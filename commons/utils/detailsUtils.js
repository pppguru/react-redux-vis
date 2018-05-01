import moment from 'moment';
import {isUndefined, getTimePairFromWindow} from '../../commons/utils/utils';
import {getCountryCode} from '../../commons/utils/countryUtils';

const LOW_SCORE_RANGE = [1, 34],
  MEDIUM_SCORE_RANGE = [35, 64],
  HIGH_SCORE_RANGE = [65, 100];

export function getColumnIndex(columns, value) {
  let columnIndex = '';
  for (let c = 0; c < columns.length; c++) {
    if (value === columns[c].name) {
      columnIndex = c;
      break;
    }
  }
  return columnIndex;
}

export function getFieldValue(rows, columnIndex) {
  let fieldValue = '';
  for (let nestedKey in rows) {
    if (!isUndefined(nestedKey) && columnIndex === 0) {
      fieldValue = (nestedKey !== '') ? nestedKey : '';
      break;
    }
  }
  return fieldValue;
}

export function getQueryParamsFromApi(parameters, key, value) {
  let {data, currentRowNumber, nestedResult} = parameters,
    queryParam = '';
  const {rows, columns} = data;

  if (nestedResult) {
    let columnIndex = getColumnIndex(columns, value),
      fieldValue = getFieldValue(rows[currentRowNumber], columnIndex);
    queryParam = key + '=' + fieldValue;
  }
  else {
    let columnIndex = getColumnIndex(columns, key);
    queryParam = key + '=' + rows[currentRowNumber][columnIndex];
  }
  return queryParam;
}

export function getQueryParamsFromKey(parameters, key, value) {
  let {duration, dataObj} = parameters,
    queryParam = '';
  switch (key) {
    case 'window':
      queryParam = key + '=' + duration;
      break;
    case 'fromAndToBasedOnToday':
      let pair = getTimePairFromWindow(duration, ''),
        dateTime1 = pair.fromDate,
        dateTime2 = pair.toDate;
      queryParam = 'from=' + dateTime1 + '&to=' + dateTime2;
      break;
    case 'fromAndToBasedOnClickedDate':
      let toolText = dataObj.toolText,
        dateStringArray = toolText.split(','),
        dateString = dateStringArray[1];
      dateString = dateString.trim();

      let localTime = moment.utc(dateString).format('YYYY-MM-DD HH:mm:ss'),
        d = new Date(localTime),
        dateInUTCFormat = moment.utc(d.toUTCString()).format('YYYY-MM-DD HH:mm:ss');

      pair = getTimePairFromWindow(duration, dateInUTCFormat);
      dateTime1 = pair.fromDate;
      dateTime2 = pair.toDate;
      queryParam = 'from=' + dateTime1 + '&to=' + dateTime2;
      break;
    case 'xAxisValueInLowerCase': {
      toolText = dataObj.toolText;
      const sectionName = toolText.split(',');
      queryParam = value + '=' + (sectionName[0]).toLowerCase();
      break;
    }
    case 'xAxisValueAsItIs': {
      toolText = dataObj.toolText;
      const sectionName = toolText.split(',');
      queryParam = value + '=' + sectionName[0];
      break;
    }
    case 'country':
      let label = dataObj.label,
        countryName = label.split(','),
        countryCode = getCountryCode[countryName[0]];
      queryParam = key + '=' + countryCode;
      break;
    case 'scoreRange':
      if ((dataObj.datasetName).toLowerCase() === 'low') {
        queryParam = 'lowScore=' + LOW_SCORE_RANGE[0] + '&highScore=' + LOW_SCORE_RANGE[1];
      }
      else if ((dataObj.datasetName).toLowerCase() === 'medium') {
        queryParam = 'lowScore=' + MEDIUM_SCORE_RANGE[0] + '&highScore=' + MEDIUM_SCORE_RANGE[1];
      }
      else if ((dataObj.datasetName).toLowerCase() === 'high') {
        queryParam = 'lowScore=' + HIGH_SCORE_RANGE[0] + '&highScore=' + HIGH_SCORE_RANGE[1];
      }
      break;
    case 'data.login.status':
      queryParam = key + '=' + value;
      break;
    default:
      break;
  }
  return queryParam;
}

export function generateQueryParam(parameters, key) {
  let {queryParamsArray} = parameters,
    value = queryParamsArray[key],
    queryParam = '',
    fromAPIResponse = false;

  if (value.includes(':fieldName')) {
    value = value.replace(':fieldName', '');
    fromAPIResponse = true;
  }

  if (value !== '' && fromAPIResponse) {
    queryParam = getQueryParamsFromApi(parameters, key, value);
  }
  else {
    queryParam = getQueryParamsFromKey(parameters, key, value);
  }
  return queryParam;
}

export function generateQueryParams(parameters) {
  let {queryParamsArray} = parameters,
    queryParams = '';
  for (let key in queryParamsArray) {
    queryParams += (queryParams === '' ? '?' : '&') + generateQueryParam(parameters, key);
  }
  return queryParams;
}

export function generateDetailsParameters(parameters) {
  let queryParams = {};
  if (Object.keys(parameters.queryParamsArray).length === 0) {
    return queryParams;
  }
  let tempQueryParams = generateQueryParams(parameters);
  tempQueryParams = tempQueryParams.replace('?', '');
  tempQueryParams = tempQueryParams.split('&');
  tempQueryParams.forEach((queryParam, index) => {
    index++;
    queryParam = queryParam.split('=');
    queryParams['detailsField' + index] = queryParam[0];
    queryParams['detailsValue' + index] = queryParam[1];
  });

  return queryParams;
}
