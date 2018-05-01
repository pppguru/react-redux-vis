import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import {formatDate} from '../../../commons/utils/dateUtils';
import { DEFAULT_FONT, DEFAULT_CHART_DIMENSIONS } from 'Constants';

const defaultChart = {
  baseFont: DEFAULT_FONT,
  captionFontSize: '14',
  subcaptionFontSize: '14',
  subcaptionFontBold: '0',
  bgcolor: '#ffffff',
  showBorder: '0',
  showShadow: '0',
  showCanvasBorder: '0',
  usePlotGradientColor: '0',
  legendBorderAlpha: '0',
  legendShadow: '0',
  showAxisLines: '0',
  showAlternateHGridColor: '0',
  divLineAlpha: '50',
  divLineColor: Colors.cloud,
  divLineThickness: '1',
  xAxisName: 'Day',
  showValues: '0',
  paletteColors: Colors.LineChartPallete,
  toolTipSepChar: ' | '
};

class MultiSeriesLineChart extends React.Component {
  static propTypes = {
    attributes: PropTypes.object
  }

  renderChart(props) {
    if (!(props.data || props.normalizeData)) return;

    let dataSource;
    if (props.normalizeData) {
      dataSource = props.normalizeData;
      dataSource.chart = Object.assign({}, defaultChart, props.chart.options);
    }

    const {chart} = props;

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: 'msline',
        renderAt: props.attributes.id,
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
    const {props} = this;
    return (
      <div id={props.attributes.id}>{this.renderChart(props)}</div>
    );
  }
}

export default MultiSeriesLineChart;
