import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import moment from 'moment';
import {
  calculateDateDisplayFormat,
  calculateDateDisplayFormatForHistogram
} from '../../../commons/utils/dateUtils';

import { generateRawData, isUndefined } from '../../../commons/utils/utils';
import { getQueryParamsForDetails } from '../../utils/utils';
import { DEFAULT_FONT } from 'Constants';

const chart = {
  showvalues: '0',
  decimals: '3',
  sFormatNumberScale: '1',
  setadaptiveymin: '1',
  setadaptivesymin: '1',
  showborder: '0',
  theme: 'zune',
  numDivLines: '6',
  showAxisLines: '1',
  showYAxisValues: '1',
  labelDisplay: 'wrap',
  rotateLabels: '1',
  xAxisName: 'TIME',
  scrollHeight: '4',
  xAxisNameFontSize: '13',
  yAxisNameFontSize: '13',
  slantLabels: '1',
  labelFontSize: '11',
  xAxisNamePadding: '20',
  yAxisNamePadding: '20',
  showXAxisLine: '1',
  showYAxisLine: '0',
  divLineIsDashed: '0',
  divLineAlpha: '20',
  chartLeftMargin: '0',
  chartRightMargin: '0',
  chartBottomMargin: '0',
  baseFont: DEFAULT_FONT,
  baseFontColor: Colors.grape,
  paletteColors: Colors.defaultGraphPalette,
  xAxisLineColor: Colors.axis,
  toolTipSepChar: ' | '
};

export function getXindex(currentChartDataColumn, columns) {
  let x = '';
  for (let c = 0; c < columns.length; c++) {
    if (currentChartDataColumn === columns[c].name) {
      x = c;
      break;
    }
  }
  return x;
}

export function getYindex(currentChartData, columns, combinedResult) {
  let y = '',
    seriesIndex = '',
    y2 = '';
  for (let c = 0; c < columns.length; c++) {
    if (!isUndefined(currentChartData.columns[0]) && currentChartData.columns[0].includes('[')) {
      let tempArray = currentChartData.columns[0].split('['),
        columnName = tempArray[0],
        indexName = tempArray[1];
      indexName = indexName.replace(']', '');

      if (columnName === columns[c].name) {
        if (!combinedResult) {
          seriesIndex = c;
        }
        else {
          y = c;
        }
        y2 = indexName;
      }
    }
    else {
      if (currentChartData.columns[0] === columns[c].name) {
        if (!combinedResult) {
          seriesIndex = c;
        }
        else {
          y = c;
        }
      }
    }
    if (!isUndefined(currentChartData.columns[1]) && currentChartData.columns[1] === columns[c].name) {
      y = c;
    }
  }

  return {
    y: y,
    y2: y2,
    seriesIndex: seriesIndex
  };
}

export function generateCategoryArray(rows, index, dateDisplayFormat) {
  let category = [],
    lookup = {};
  for (let d = 0, rowsLen = rows.length; d < rowsLen; d++) {
    let utcTime = moment.utc(rows[d][index]).format('YYYY-MM-DD HH:mm:ss.SSS'),
      localTime = moment.utc(utcTime).toDate();
    localTime = moment(localTime).format('D MMM YYYY HH:mm:ss.SSS');

    let localTimeNew = moment.utc(rows[d][index]).toDate();
    localTimeNew = moment(localTimeNew).format(dateDisplayFormat);

    if (!(localTime in lookup)) {
      lookup[localTime] = 1;
      const obj1 = {
        label: localTimeNew,
        toolText: localTime
      };

      category.push(obj1);
    }
  }

  return category;
}

export function generateDataAndSeriesArrayForDynamicSeriesNames(rows, x, y, seriesIndex) {
  let newRawData = [],
    newRawDataRow = [],
    seriesValuesIndex = 0,
    seriesNameArray = [],
    lookup = {},
    previousXAxisName = '';
  for (let d = 0, rowsLen = rows.length; d < rowsLen; d++) {
    let seriesName = rows[d][seriesIndex],
      currentXAxisName = rows[d][x];

    if (currentXAxisName !== '') {
      if (currentXAxisName !== previousXAxisName || d === 0) {
        if (d !== 0) {
          newRawData.push(newRawDataRow);
        }
        newRawDataRow = [];
        newRawDataRow[0] = currentXAxisName;
        newRawDataRow[1] = [0, 0, 0];
        seriesValuesIndex = 0;
      }
      if (seriesName !== '') {
        newRawDataRow[1][seriesValuesIndex] = rows[d][y];
        seriesValuesIndex += 1;

        if (!(seriesName in lookup)) {
          lookup[seriesName] = 1;
          const obj1 = {
            seriesname: seriesName
          };
          seriesNameArray.push(obj1);
        }
      }
      previousXAxisName = currentXAxisName;
    }
  }
  return {
    newRawData: newRawData,
    seriesNameArray: seriesNameArray
  };
}

export function generateChartDataSetForDynamicSeries(currentChartData, seriesNameArray, newRawData) {
  let dataset = [];
  for (let seriesCount = 0, rowsLen = seriesNameArray.length; seriesCount < rowsLen; seriesCount++) {
    const seriesOptions = currentChartData.seriesOptions,
      tempObj = {};
    tempObj.seriesname = seriesNameArray[seriesCount].seriesname;
    tempObj.data = [];

    for (let s in seriesOptions) {
      if (s !== 'anchorBorderColor' || s !== 'anchorbgcolor' || s !== 'anchorsides') {
        tempObj[s] = seriesOptions[s];
      }
    }
    if (!isUndefined(seriesOptions.anchorBorderColor)) {
      tempObj.anchorBorderColor = seriesOptions.anchorBorderColor[seriesCount];
    }
    if (!isUndefined(seriesOptions.anchorbgcolor)) {
      tempObj.anchorbgcolor = seriesOptions.anchorbgcolor[seriesCount];
    }
    if (!isUndefined(seriesOptions.anchorsides)) {
      tempObj.anchorsides = seriesOptions.anchorsides[seriesCount];
    }

    // Get column data for y-axis
    tempObj.data = generateDataArray(tempObj, 1, newRawData, seriesCount, 'dynamic');
    dataset.push(tempObj);
  }
  return dataset;
}

export function generateChartDataSetForFixedSeries(dataset, currentChartData, rows, y, y2) {
  const tempObj = {};

  tempObj.seriesname = currentChartData.seriesname;
  tempObj.renderas = currentChartData.renderas;
  tempObj.data = [];

  // Get column data for y-axis
  if (y !== '') {
    tempObj.data = generateDataArray(tempObj, y, rows, y2, 'fixed');
  }
  dataset.push(tempObj);
  return dataset;
}

// Function to generate data array for chart data source
export function generateDataArray(tempObj, y, rows, y2, seriesType) {
  for (let d = 0, rowsLen = rows.length; d < rowsLen; d++) {
    let rowObj = {};
    switch (seriesType) {
      case 'dynamic':
        if (rows[d][y][y2] !== 0 && rows[d][y][y2] !== 'NaN') {
          rowObj.value = rows[d][y][y2];
        }
        break;
      case 'fixed':
        if (rows[d][y][y2] !== 'NaN') {
          rowObj.value = rows[d][y][y2];
        }
        else {
          rowObj.value = 0;
        }
        break;
      default:
        break;
    }
    tempObj.data.push(rowObj);
  }
  return tempObj.data;
}

export function generateChartDataSource(rawData, props) {
  const {duration, chartOptions, chartData} = props,
    fieldMapping = chartData.fieldMapping,
    combinedResult = chartData.combinedResult,
    categories = [{
      category: []
    }];

  let dataset = [],
    timeWindow = duration,
    dateDisplayFormat = calculateDateDisplayFormat(timeWindow),
    x = '';

  if (combinedResult) {
    dateDisplayFormat = calculateDateDisplayFormatForHistogram(timeWindow);
  }

  for (let i = 0; i < fieldMapping.length; i++) {
    let currentChartData = fieldMapping[i],
      {rows, columns} = rawData[currentChartData.reportId],
      y = '',
      y2 = '',
      seriesIndex = '';

    // Check for x-axis chart data
    if (!isUndefined(currentChartData.axis) && currentChartData.axis === 'x') {
      x = getXindex(currentChartData.columns[0], columns);
      if (x !== '') {
        categories[0].category = generateCategoryArray(rows, x, dateDisplayFormat);
      }
    }

    // Check for y-axis chart data (i.e. multiple series)
    if (!isUndefined(currentChartData.axis) && currentChartData.axis === 'y') {
      let yIndex = getYindex(currentChartData, columns, combinedResult);
      y = yIndex.y;
      y2 = yIndex.y2;
      seriesIndex = yIndex.seriesIndex;

      if (!isUndefined(currentChartData.seriesOptions)) {
        let dynamicArray = generateDataAndSeriesArrayForDynamicSeriesNames(rows, x, y, seriesIndex),
          newRawData = dynamicArray.newRawData,
          seriesNameArray = dynamicArray.seriesNameArray;

        dataset = generateChartDataSetForDynamicSeries(currentChartData, seriesNameArray, newRawData);
      }
      if (!isUndefined(currentChartData.seriesname)) {
        dataset = generateChartDataSetForFixedSeries(dataset, currentChartData, rows, y, y2);
      }
    }
  }

  let annotationItems = [];
  if (!isUndefined(props.meta.subTitle)) {
    let yPadding = '370';
    if (props.duration === '1w' || props.duration === '1mo' || props.duration === '2mo') {
      yPadding = '378';
    }
    annotationItems = annotationItems.concat([
      {
        id: 'unit',
        type: 'text',
        text: props.meta.subTitle,
        x: '$chartEndX - 633',
        y: '$chartEndY - ' + yPadding,
        fontSize: '11',
        color: Colors.pebble,
        font: DEFAULT_FONT,
        rotateText: 'left'
      }
    ]);
  }

  const dataSourceObject = {
    chart: Object.assign({}, chart, chartOptions),
    'annotations': {'groups': [{'items': annotationItems}]}
  };

  if (categories.length > 0) {
    dataSourceObject.categories = categories;
  }

  if (dataset.length > 0) {
    dataSourceObject.dataset = dataset;
  }

  return dataSourceObject;
}

class MultiSeriesCombiChart extends React.Component {
  static propTypes = {
    attributes: PropTypes.object,
    meta: PropTypes.object
  }

  renderChart() {
    const {props} = this;

    if (props.data && props.data.rows && props.data.rows.length === 0) {
      return;
    }

    const {data, attributes, showDetailsTable, details} = props,
      fieldMapping = props.chartData.fieldMapping,
      rawData = generateRawData(fieldMapping, data);

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: 'mscombi2d',
        renderAt: attributes.id,
        width: attributes.chartWidth ? attributes.chartWidth : '100%',
        height: attributes.chartHeight ? attributes.chartHeight : '400',
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource: generateChartDataSource(rawData, props),
        events: {
          dataplotClick: function(eventObj, dataObj) {
            let queryParams = getQueryParamsForDetails(details.meta.queryParams, dataObj);
            showDetailsTable(queryParams);
          }
        }
      });

      fusioncharts.render();
    });
  }

  renderChartPreProcessed(dataSource, attributes) {
    dataSource.chart = Object.assign({}, chart, dataSource.chart);

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: 'mscombi2d',
        renderAt: attributes.id,
        width: attributes.chartWidth ? attributes.chartWidth : '100%',
        height: attributes.chartHeight ? attributes.chartHeight : '400',
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource
      });

      fusioncharts.render();
    });
  }

  render() {
    const {props} = this,
      {attributes, meta, data} = props;

    if (typeof data === 'undefined') return null;
    if (data === null) return null;

    if (props.processedData) {
      return (
        <div id={attributes.id}>{this.renderChartPreProcessed(data, attributes)}</div>
      );
    }

    return (
      <div>
        <div style={attributes.chartCaption}>{meta.title}</div>
        <div id={attributes.id}>{this.renderChart()}</div>
      </div>
    );
  }
}

MultiSeriesCombiChart.contextTypes = {
  clickThrough: React.PropTypes.func
};

export default MultiSeriesCombiChart;
