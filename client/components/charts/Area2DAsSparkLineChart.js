import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import {getDateTimeInLocalTimeZone} from '../../../commons/utils/utils';
import { DEFAULT_CHART_OPTIONS } from 'Constants';

const chartDefaultOptions = Object.assign({}, DEFAULT_CHART_OPTIONS, {
  paletteColors: Colors.areaSparkLineChart.area,
  showCanvasBorder: '0',
  usePlotGradientColor: '0',
  showXAxisLine: '1',
  axisLineAlpha: '25',
  divLineAlpha: '0',
  showValues: '0',
  showXAxisValues: '1',
  showYAxisValues: '1',
  showAlternateHGridColor: '0',
  showPlotBorder: '1',
  plotBorderColor: Colors.areaSparkLineChart.border,
  plotBorderThickness: '1',
  anchorradius: '0',
  bgAlpha: '0',
  canvasBgAlpha: '0',
  minimizetendency: '1',
  labelDisplay: 'wrap',
  rotateLabels: '1'
});

export function generateDataSource(chart, data) {
  let dataSourceObject = {},
    dataSet = [],
    dataObject = [],
    dataSeries = {},
    value = data[0].value;

  for (let key in value) {
    let label = key;
    if (new Date(key).toString() !== 'Invalid Date') {
      label = getDateTimeInLocalTimeZone(key, 'D MMM');
    }
    let dataPoint = {
      label,
      value: '0'
    };
    if (value[key][0] !== 0 && value[key][0] !== '') {
      dataPoint.value = value[key][0];
    }
    dataObject.push(dataPoint);
  }

  dataSeries.data = dataObject;
  dataSet.push(dataSeries);

  dataSourceObject.chart = Object.assign(chartDefaultOptions, chart.options);

  if (dataSet.length > 0) {
    dataSourceObject.dataset = dataSet;
  }

  return dataSourceObject;
}

class Area2DAsSparkLineChart extends React.Component {
  static propTypes = {
    chart: PropTypes.object,
    data: PropTypes.array
  }

  renderChart() {
    const {props: {chart, data}} = this;

    if (!chart.type) {
      return;
    }

    FusionCharts.ready(function() {
      let fusioncharts = new FusionCharts({
        type: chart.type,
        renderAt: chart.id,
        width: chart.width,
        height: chart.height,
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource: generateDataSource(chart, data)
      }
    );
      fusioncharts.render();
    });
  }

  render() {
    const {props} = this;
    return (
      <div id={props.chart.id}>{this.renderChart()}</div>
    );
  }
}

export default Area2DAsSparkLineChart;
