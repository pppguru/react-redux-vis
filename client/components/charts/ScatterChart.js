import React, {PropTypes} from 'react';
import {isEmpty} from '../../../commons/utils/utils';
import {Colors} from '../../../commons/colors';
import {
  DEFAULT_FONT,
  DEFAULT_CHART_OPTIONS,
  DEFAULT_CHART_DIMENSIONS
} from 'Constants';
import NoDataWidget from '../widgets/NoDataWidget';

const chartOptions = Object.assign({}, DEFAULT_CHART_OPTIONS, {
  'showvalues': '0',
  'theme': 'zune',
  'showAxisLines': '1',
  'showYAxisValues': '1',
  'labelDisplay': 'wrap',
  'rotateLabels': '0',
  'showlegend': '0',
  'bgAlpha': '0',
  'canvasBgAlpha': '0',
  'labelFontSize': '10',
  'baseFont': DEFAULT_FONT,
  'baseFontColor': Colors.pebble,
  'xAxisNameFontSize': '13',
  'yAxisNameFontSize': '13',
  'xAxisNamePadding': '20',
  'yAxisNamePadding': '20',
  'lineColor': Colors.coral,
  'divLineIsDashed': '0',
  'showsYAxisLine': '0',
  'divLineAlpha': '20',
  'chartLeftMargin': '0',
  'chartRightMargin': '0',
  'chartBottomMargin': '0',
  'numVDivLines': '10',
  'canvasBgColor': Colors.defaultCanvasBG,
  'canvasbgAlpha': '100',
  'canvasBgRatio': '30,70',
  'canvasBgAngle': '280',
  'xAxisLineColor': Colors.axis,
  'yaxislinecolor': Colors.axis,
  'toolTipSepChar': ' | '
});

export function generateDataSource(data, chart) {
  let dataSourceObject = {},
    dataSet = [],
    dataObject = [],
    dataSeries = {
      'drawline': '0',
      'anchorsides': '0',
      'anchorradius': '6',
      'color': Colors.bar,
      'anchorbgcolor': Colors.bar,
      'anchorbordercolor': Colors.bar,
      'seriesname': ''
    };

  data.forEach((row) => {
    let {x, y, toolText} = row;
    dataObject.push({x, y, toolText});
    dataSeries.data = dataObject;
    dataSet.push(dataSeries);
  });

  dataSourceObject.chart = Object.assign({}, chartOptions, chart.options);

  if (dataSet.length > 0) {
    dataSourceObject.dataset = dataSet;
  }

  return dataSourceObject;
}

class ScatterChart extends React.Component {
  static propTypes = {
    attributes: PropTypes.object,
    data: PropTypes.object,
    chart: PropTypes.object
  }

  renderChart() {
    const {props: {data: {normalizeData}, attributes, chart}} = this;

    let dataSource = generateDataSource(normalizeData, chart);

    FusionCharts.ready(function() {
      let fusioncharts = new FusionCharts({
        type: 'scatter',
        renderAt: attributes.id,
        width: chart.width || DEFAULT_CHART_DIMENSIONS.width,
        height: chart.height || DEFAULT_CHART_DIMENSIONS.height,
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource
      });
      fusioncharts.render();
    });
  }

  render() {
    const {props: {data, attributes}} = this;

    if (!data) {
      return (<div />);
    }

    const {normalizeData} = data; // here, getting normalized data from its data abstraction layer

    if (isEmpty(normalizeData)) {
      return (<NoDataWidget />);
    }

    return (
      <div id={attributes.id}>{this.renderChart()}</div>
    );
  }
}

export default ScatterChart;
