import {
  isUndefined,
  getIndexFromObjectName,
  msToTime,
  formatBytes,
  formatDateInLocalTimeZone,
  firstCharCapitalize,
  generateRawData,
  getParameterByName
} from '../../commons/utils/utils';

import {getCountryName} from '../../commons/utils/countryUtils';
import {generateDetailsParameters} from '../../commons/utils/detailsUtils';

export function processData(data, tableJson, url) {
  const {fieldMapping, nestedResult, emptyValueMessage} = tableJson.data;
  let tableDataSource = [];

  let rawData = generateRawData(fieldMapping, data);

  fieldMapping.forEach((tableData) => {
    let {rows, columns} = rawData[tableData.reportId],
      columnText = [];

    rows.forEach((row, rowIndex) => {
      let rowObject = {columns: []};

      // Calculate column index from API response
      tableData.columns.forEach((tableColumns, columnIndex) => {
        let columnType = tableColumns.type,
          columnData = tableColumns.data,
          rowColumnDetails = {
            columnType,
            columnData,
            columns,
            dataRows: row,
            columnText,
            nestedResult,
            emptyValueMessage,
            columnIndex
          },
          rowDetails = {
            columnType,
            columnData: tableColumns,
            columnText: getDataBasedOnResponse(rowColumnDetails),
            rowNumber: rowIndex,
            row
          };

        rowObject = generateRowObject(rowDetails, rowObject);
        if (tableJson.details) {
          let parameters = {
            data,
            duration: getParameterByName('window', url),
            queryParamsArray: tableJson.details.meta.queryParams ? tableJson.details.meta.queryParams : {},
            currentRowNumber: rowIndex,
            nestedResult,
            pathParams: tableJson.details.pathParams
          };
          rowObject.dataObj = {
            queryParams: generateDetailsParameters(parameters)
          };
        }
        columnText = [];
      });
      tableDataSource.push(rowObject);
    });
  });

  return tableDataSource;
}

export function getDataBasedOnResponse(rowColumnDetails) {
  let {columnType, columnData, columns, dataRows,
    columnText, nestedResult, emptyValueMessage, columnIndex} = rowColumnDetails;

  for (let i = 0; i < columnData.length; i++) {
    if (columns.length === 1 && columns[0].name === 'json') {
      // This condition is if API response returns a single column with one JSON object. e.g. recent alerts table
      let columnDetails = {
        columnType,
        columnData: columnData[i],
        dataRows,
        columnText
      };
      columnText = getDataBySingleColumnResponse(columnDetails);
    }
    else {
      // This else condition is if API response returns multiple columns
      // Calculate column index from API response
      for (let j = 0; j < columns.length; j++) {
        if (columns[j].name === columnData[i].fieldName) {
          let columnDetails = {
            columnType,
            columnData: columnData[i],
            dataRows,
            columnText,
            columnIndex: j,
            columnIndexLayoutJSON: columnIndex,
            nestedResult,
            emptyValueMessage
          };
          columnText = getDataByMultiColumnsResponse(columnDetails);
        }
      }
    }
  }// Column data loop ends

  return columnText;
}

export function generateRowObject(rowDetails, rowObject) {
  let {
      columnType,
      columnData,
      columnText,
      rowNumber,
      ellipsis
    } = rowDetails,
    {header, style, chart, headingStyle, inverse} = columnData;

  if (chart) {
    let tempId = chart.id;
    chart = Object.assign({}, chart, {id: tempId + rowNumber});
  }

  let rowObj = {
      type: columnType,
      name: header,
      rowNumber,
      chart,
      style,
      headingStyle,
      ellipsis
    },
    sortValueDefault = columnText[0] ? columnText[0].value : '',
    sortValue = '';

  if (inverse) {
    rowObj = Object.assign({}, rowObj, {inverse: true});
  }

  columnText.forEach((column, index) => {
    sortValue += ' ' + column.value;
  });

  rowObj = Object.assign(rowObj, {
    data: columnText,
    sortValue: columnType === 'durationWidget' ? (msToTime(sortValueDefault)).timeString : sortValue
  });
  columnText = [];
  rowObject.columns.push(rowObj);
  return rowObject;
}

export function getDataBySingleColumnResponse(columnDetails) {
  let {columnType, columnData, dataRows, columnText} = columnDetails;

  let fieldValue = '',
    {fieldName, displayName} = columnData,
    fieldValueArray = [],
    inputArray = {
      fieldName,
      fieldValueArray,
      fieldValue,
      dataArray: dataRows[0]
    };

  fieldValue = getIndexFromObjectName(inputArray);

  columnDetails = {
    columnType,
    fieldName,
    displayName,
    fieldValue,
    columnText
  };

  return getColumnText(columnDetails);
}

export function getDataByMultiColumnsResponse(columnDetails) {
  let {columnType, columnData, dataRows,
    columnText, chartValue, timeValue, columnIndex, columnIndexLayoutJSON, nestedResult,
    emptyValueMessage} = columnDetails,
    fieldValue = '',
    {fieldName, displayName} = columnData;
  if (!isUndefined(dataRows[columnIndex])) {
    fieldValue = dataRows[columnIndex];
  }

  // Following condition is for nested API response
  if (nestedResult) {
    columnDetails = {
      dataRows,
      fieldValue,
      columnIndexLayoutJSON,
      emptyValueMessage
    };
    fieldValue = calculateFieldValueForNestedResult(columnDetails);
  }

  columnDetails = {
    columnType,
    fieldName,
    displayName,
    fieldValue,
    columnText,
    chartValue,
    timeValue
  };

  return getColumnText(columnDetails);
}

export function calculateFieldValueForNestedResult(columnDetails) {
  let {dataRows, fieldValue, columnIndexLayoutJSON, emptyValueMessage} = columnDetails;
  for (let key in dataRows) {
    if (!isUndefined(key)) {
      if (columnIndexLayoutJSON === 0) {
        fieldValue = (key !== '') ? key : emptyValueMessage;
      }
      else if (columnIndexLayoutJSON === 1) {
        fieldValue = dataRows[key];
      }
    }
  }
  return fieldValue;
}

export function getColumnText(columnDetails) {
  let {columnType, fieldValue, columnText} = columnDetails;

  if (columnType === 'text') {
    columnText = generateColumnText(columnDetails);
  }
  else {
    columnText.push({
      value: fieldValue
    });
  }

  return columnText;
}

export function appendColumnText(fieldName, displayName, fieldValue, columnText) {
  let name = displayName ? displayName.toLowerCase() : '';

  if (!isUndefined(fieldName)) {
    if (name === 'date') {
      let dateTime = formatDateInLocalTimeZone(fieldValue);
      columnText.push({
        value: dateTime.date
      });
      columnText.push({
        value: dateTime.time
      });
    }
    else if (name === 'port') {
      const val = columnText[columnText.length - 1];
      if (val && val.value) {
        val.value = columnText[columnText.length - 1].value + ':' + fieldValue;
      }
    }
    else if (name === 'country') {
      columnText.push({
        header: firstCharCapitalize(displayName),
        value: getCountryName[fieldValue.toUpperCase()],
        flag: fieldValue
      });
    }
    else if (name.includes('bytes')) {
      columnText.push({
        header: displayName,
        value: formatBytes(fieldValue, 2)
      });
    }
    else if (name === 'users') {
      if (!isUndefined(fieldValue.length)) {
        if (fieldValue.length === 1) {
          displayName = 'User';
        }
        let values = '';
        for (let i = 0; i < fieldValue.length; i++) {
          if (i > 0) {
            values += ', ';
          }
          values += fieldValue[i].info.displayName;
        }

        columnText.push({
          header: displayName,
          value: values
        });
      }
    }
    else if (name !== '') {
      columnText.push({
        header: displayName,
        value: fieldValue
      });
    }
    else if (name === '') {
      columnText.push({
        value: fieldValue
      });
    }
    else {
      columnText.push({
        type: displayName.toLowerCase(),
        value: fieldValue
      });
    }
  }
  else {
    columnText.push({
      value: fieldValue
    });
  }

  return columnText;
}

export function generateColumnText(columnDetails) {
  let {fieldName, displayName, fieldValue, columnText} = columnDetails;

  if (!isUndefined(fieldValue) && fieldValue !== '' && fieldValue !== null) {
    columnText = appendColumnText(fieldName, displayName, fieldValue, columnText);
  }

  return columnText;
}
