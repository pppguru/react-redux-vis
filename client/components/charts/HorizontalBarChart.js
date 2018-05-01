import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import {
  generateRawData,
  getColumnIndexArrayFromColumnName,
  getIndexFromColumnName,
  getIndexFromObjectName,
  isUndefined,
  kFormatter
} from '../../../commons/utils/utils';

import { getColorRanges } from '../../../commons/utils/colorUtils';
import { getQueryParamsForDetails } from '../../utils/utils';

import { DEFAULT_FONT } from 'Constants';

const styles = {
  chartCaption: {
    fontSize: '14px',
    color: Colors.grape
  },
  minHeight: {
    minHeight: '150px'
  },
  noData: {},
  subTitle: {
    fontSize: '12px'
  }
};

export function generateDataArray(parameters) {
  let {
      columnIndexArray,
      rowsArray,
      displayTopFive,
      orgDataset,
      connection,
      numberSuffix
    } = parameters,
    dataset = [],
    annotationItems = [],
    valueIndex = 0,
    secureConnectionsValues = [],
    maliciousConnectionsValues = [];

  if (columnIndexArray.length !== 0) {
    for (let d = 0, rowsLen = rowsArray.length; d < rowsLen; d++) {
      let labelExists = 0,
        label1 = rowsArray[d][columnIndexArray[0]];

      if (displayTopFive) {
        for (let j = 0; j < orgDataset.length; j++) {
          let label2 = orgDataset[j].label;
          if (label1 === label2) {
            labelExists = 1;
            break;
          }
        }
      }

      if (!labelExists && label1 !== 'N/A') {
        const obj1 = {
          label: label1,
          value: rowsArray[d][columnIndexArray[1]],
          connection: connection,
          toolText: rowsArray[d][columnIndexArray[0]] + ' | ' + rowsArray[d][columnIndexArray[1]]
        };

        dataset.push(obj1);

        if (displayTopFive) {
          let value = obj1.value;
          if (connection === 'secure' || connection === 'malicious') {
            if (value !== null && parseInt(value) !== 0) {
              if (connection === 'secure') {
                secureConnectionsValues[valueIndex] = value;
              }
              if (connection === 'malicious') {
                maliciousConnectionsValues[valueIndex] = value;
              }
              valueIndex++;
            }
          }
        }
        else {
          annotationItems = annotationItems.concat([
            {
              id: 'datasetlabel' + d,
              type: 'text',
              text: kFormatter(obj1.value) + numberSuffix + ' ',
              align: 'left',
              x: '$chartEndX - 146',
              y: '$dataset.0.set.' + d + '.CenterY',
              fontSize: '11',
              color: Colors.grape,
              font: DEFAULT_FONT
            }
          ]);
        }
      }
    }
  }

  return {
    dataset: dataset,
    annotationItems: annotationItems,
    secureConnectionsValues: secureConnectionsValues,
    maliciousConnectionsValues: maliciousConnectionsValues
  };
}

export function generateDataSource(rawData, chartOptions, chartData, chart) {
  const {fieldMapping, multipleReportIds, displayTopFive, showTrendLines, trendLines} = chartData,
    numberSuffix = (!isUndefined(chartOptions.numberSuffix)) ? chartOptions.numberSuffix : '',
    singleLineCharacters =
      (!isUndefined(chartOptions.singleLineCharacters)) ? chartOptions.singleLineCharacters : '15';

  let countValue = 0,
    totalValue = 0,
    top10TotalValue = 0,
    top10CountValue = 0,
    averageValue = '',
    dataset = [],
    annotationItems = [],
    dataArray = [],
    paletteColors = '',
    secureConnectionsValues = [],
    maliciousConnectionsValues = [];

  for (let i = 0; i < fieldMapping.length; i++) {
    let currentChartData = fieldMapping[i],
      {rows, columns} = rawData[currentChartData.reportId],
      columnIndexArray = [];

    top10CountValue = 0;
    top10TotalValue = 0;
    averageValue = '';

    // Calculate column index from API response
    if (multipleReportIds) {
      for (let d = 0, rowsLen = rows.length; d < rowsLen; d++) {
        if (currentChartData.reportId === 'taf_asset_count_time_shifted') {
          let fieldValue = '',
            fieldName = currentChartData.columns[0],
            fieldValueArray = [],
            inputArray = {
              fieldName: fieldName,
              fieldValueArray: fieldValueArray,
              fieldValue: fieldValue,
              dataArray: rows[d]
            };

          countValue = getIndexFromObjectName(inputArray);
        }

        if (currentChartData.reportId === 'taf_total_usage') {
          let columnIndex = '';
          columnIndex = getIndexFromColumnName(currentChartData.columns, columns);
          totalValue = rows[d][columnIndex];
        }

        if (currentChartData.reportId === 'taf_top_talkers_connections' ||
          currentChartData.reportId === 'taf_top_talkers_bandwidth') {
          let fieldValue = '',
            columnIndex = '';
          columnIndex = getIndexFromColumnName(currentChartData.columns, columns);
          fieldValue = rows[d][columnIndex];
          let value = Math.round(((fieldValue * 100) / totalValue), 2);
          if (value > 0) {
            top10CountValue = top10CountValue + 1;
            top10TotalValue = top10TotalValue + parseInt(fieldValue);
          }
        }
      }

      const reportId = chartData.reportId;
      rows = rawData[reportId].rows;
      let average = top10TotalValue / parseInt(countValue),
        newRawData = [];
      averageValue = Math.round(((average * 100) / totalValue), 2);

      for (let d = 0, rowsLen = rows.length; d < rowsLen; d++) {
        let obj = [];
        obj[0] = rows[d][0];
        let value = Math.round(((rows[d][1] * 100) / totalValue), 2);
        obj[1] = value;
        if (value > 0) {
          newRawData.push(obj);
        }
      }
      columnIndexArray = [0, 1]; // Need to generate this index array dynamically. For now, kept it as hardcode
      let parameters = {
        columnIndexArray: columnIndexArray,
        rowsArray: newRawData,
        displayTopFive: displayTopFive,
        orgDataset: dataset,
        connection: '',
        numberSuffix: numberSuffix,
        singleLineCharacters: singleLineCharacters
      };
      dataArray = generateDataArray(parameters);
      dataset = dataArray.dataset;
      annotationItems = dataArray.annotationItems;
    }
    else {
      if (currentChartData.connection === 'secure' || currentChartData.connection === 'malicious') {
        columnIndexArray = getColumnIndexArrayFromColumnName(currentChartData.columns, columns);

        let valueIndex = 0;
        // Calculate max connections values and create color ranges for both secure and malicious connections
        for (let l = 0, rowsLen = rows.length; l < rowsLen; l++) {
          if (rows[l][columnIndexArray[0]] === 'N/A') {
            // continue;
          }
          else {
            let value = rows[l][columnIndexArray[1]];
            if (currentChartData.connection === 'secure' || currentChartData.connection === 'malicious') {
              if (value !== null && parseInt(value) !== 0) {
                if (currentChartData.connection === 'secure') {
                  secureConnectionsValues[valueIndex] = value;
                }
                if (currentChartData.connection === 'malicious') {
                  maliciousConnectionsValues[valueIndex] = value;
                }
                valueIndex++;
              }
            }
          }
        }

        let colorRanges = getColorRanges(secureConnectionsValues, maliciousConnectionsValues),
          secureColorRanges = colorRanges.secure,
          maliciousColorRanges = colorRanges.malicious,
          parameters = {
            columnIndexArray: columnIndexArray,
            rowsArray: rows,
            displayTopFive: displayTopFive,
            orgDataset: dataset,
            connection: currentChartData.connection,
            numberSuffix: numberSuffix,
            singleLineCharacters: singleLineCharacters
          };

        dataArray = generateDataArray(parameters);
        dataset = dataset.concat(dataArray.dataset);

        if (currentChartData.connection === 'malicious') {
          maliciousConnectionsValues = dataArray.maliciousConnectionsValues;
        }

        if (displayTopFive && currentChartData.connection === 'secure') {
          dataset.sort(function(a, b) {
            return b.value - a.value;
          });
          dataset = dataset.slice(0, 5);

          for (let j = 0; j < dataset.length; j++) {
            annotationItems = annotationItems.concat([
              {
                id: 'datasetlabel' + j,
                type: 'text',
                text: dataset[j].label,
                align: 'left',
                x: '$chartEndX - 146',
                y: '$dataset.0.set.' + j + '.CenterY',
                fontSize: '11',
                color: Colors.grape,
                font: DEFAULT_FONT
              }
            ]);

            if (dataset[j].connection === 'malicious') {
              for (let p = 0; p < maliciousColorRanges.length; p++) {
                if (maliciousColorRanges[p].min <= parseInt(dataset[j].value) &&
                  maliciousColorRanges[p].max >= parseInt(dataset[j].value)) {
                  if (paletteColors !== '') {
                    paletteColors = paletteColors + ',' + maliciousColorRanges[p].color;
                  }
                  else {
                    paletteColors = maliciousColorRanges[p].color;
                  }
                  break;
                }
              }
            }
            if (dataset[j].connection === 'secure') {
              for (let p = 0; p < secureColorRanges.length; p++) {
                if (secureColorRanges[p].min <= parseInt(dataset[j].value) &&
                  secureColorRanges[p].max >= parseInt(dataset[j].value)) {
                  if (paletteColors !== '') {
                    paletteColors = paletteColors + ',' + secureColorRanges[p].color;
                  }
                  else {
                    paletteColors = secureColorRanges[p].color;
                  }
                  break;
                }
              }
            }
          }
        }
      }
      else {
        columnIndexArray = getColumnIndexArrayFromColumnName(currentChartData.columns, columns);
        let parameters = {
          columnIndexArray: columnIndexArray,
          rowsArray: rows,
          displayTopFive: displayTopFive,
          orgDataset: dataset,
          connection: '',
          numberSuffix: numberSuffix,
          singleLineCharacters: singleLineCharacters
        };
        dataArray = generateDataArray(parameters);
        dataset = dataArray.dataset;
        annotationItems = dataArray.annotationItems;
      }
    }
  }

  if (dataset.length < 5) {
    let len = 5 - parseInt(dataset.length);
    for (let n = 0; n < len; n++) {
      let obj1 = {};
      obj1.label = '';
      obj1.value = '';
      obj1.connection = '';
      dataset.push(obj1);
    }
  }

  const dataSourceObject = {
    chart: Object.assign({
      'paletteColors': Colors.defaultGraphPalette,
      'bgColor': Colors.white,
      'showBorder': '0',
      'showCanvasBorder': '0',
      'usePlotGradientColor': '0',
      'placeValuesInside': '1',
      'valueFontColor': Colors.grape,
      'showAxisLines': '1',
      'axisLineAlpha': '15',
      'alignCaptionWithCanvas': '0',
      'showAlternateVGridColor': '0',
      'captionFontSize': '14',
      'subcaptionFontSize': '14',
      'subcaptionFontBold': '0',
      'showLabels': '0',
      'divLineAlpha': '50',
      'divLineColor': Colors.cloud,
      'divLineThickness': '1',
      'plotBorderAlpha': '0',
      'chartRightMargin': '150',
      'animation': '0',
      'toolTipColor': Colors.white,
      'toolTipBorderThickness': '0',
      'toolTipBgColor': Colors.black,
      'toolTipBgAlpha': '80',
      'toolTipBorderRadius': '2',
      'toolTipPadding': '5',
      'showYAxisValues': '0',
      'showValues': '1',
      'xAxisNameFontSize': '14',
      'yAxisNameFontSize': '14',
      'labelFontSize': '11',
      'numDivLines': '4',
      'baseFont': DEFAULT_FONT,
      'baseFontColor': Colors.grape,
      'toolTipSepChar': ' | '
    }, chartOptions)
  };

  if (!(chart && chart.showAnnotations === false)) {
    dataSourceObject.annotations = {'groups': [{'items': annotationItems}]};
  }

  if (paletteColors !== '') {
    dataSourceObject.chart.paletteColors = paletteColors;
  }

  if (dataset.length < 5) {
    dataSourceObject.chart = Object.assign(dataSourceObject.chart, {'Plotspacepercent': '100'});
  }

  if (dataset.length > 0) {
    dataSourceObject.data = dataset;
  }

  if (showTrendLines && averageValue !== undefined && averageValue !== '') {
    dataSourceObject.trendlines = trendLines;
    dataSourceObject.trendlines[0].line[0].startvalue = averageValue;
    dataSourceObject.trendlines[0].line[0].displayvalue = averageValue +
    (chartOptions.numberSuffix ? chartOptions.numberSuffix : '');
  }

  return dataSourceObject;
}

class HorizontalBarChart extends React.Component {
  static propTypes = {
    attributes: PropTypes.object,
    meta: PropTypes.object
  }

  renderChart(props) {
    if (!props.data) return;

    styles.noData = {};

    const data = props.data,
      fieldMapping = props.chartData.fieldMapping,
      {chartOptions, chartData, chart, showDetailsTable, details} = props;

    let rawData = {};
    rawData = generateRawData(fieldMapping, data);

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: 'bar2d',
        renderAt: props.attributes.id,
        width: props.attributes.chartWidth ? props.attributes.chartWidth : '100%',
        height: props.attributes.chartHeight ? props.attributes.chartHeight : '400',
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource: generateDataSource(rawData, chartOptions, chartData, chart),
        events: {
          dataplotClick: function(eventObj, dataObj) {
            let queryParams = getQueryParamsForDetails(details.meta.queryParams, dataObj);
            showDetailsTable && showDetailsTable(queryParams);
          }
        }
      });
      fusioncharts.render();
    });
  };

  render() {
    const {props} = this;
    this.renderChart(props);

    let chartStyle = props.chart && props.chart.style ? props.chart.style : {};

    return (
      <div style={{...props.attributes.chartBorder, ...styles.noData}}>
        {
          props.loadAsLegend
          ? <div style={{...styles.chartCaption, ...props.attributes.chartCaption}}>{props.meta.title}
            <span style={styles.subTitle}> {props.meta.subTitle}</span>
          </div>
          : null
        }
        <div id={props.attributes.id} style={{...styles.minHeight, ...chartStyle}} />
      </div>
    );
  }
}

export default HorizontalBarChart;
