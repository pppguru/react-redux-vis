import React, { PropTypes } from 'react';
import { DEFAULT_FONT, DEFAULT_CHART_DIMENSIONS } from 'Constants';

const chart = {
  caption: '',
  theme: 'fint',
  radarfillcolor: '#ffffff',
  baseFont: DEFAULT_FONT,
  divLineAlpha: '20',
  showBorder: '0',
  showShadow: '0',
  showCanvasBorder: '0',
  toolTipSepChar: ' | '
};

class RadarChart extends React.Component {
  static propTypes = {
    data: PropTypes.array,
    chart: PropTypes.object.isRequired
  }

  getDataSource() {
    const {props} = this,
      {data, chart: {options}} = props;

    const category = data.map(val => ({label: val.message.split(' ').join('{br}')}));
    const datasetArr = data.map(val => ({value: Math.round(val.contribution)}));

    const dataset = [{seriesname: '', data: datasetArr}];
    const categories = [{category}];

    return {
      chart: Object.assign({}, chart, options),
      dataset,
      categories
    };
  }

  renderChart() {
    const {props, props: {chart}} = this;
    const dataSource = this.getDataSource();

    FusionCharts.ready(function() {
      var fusioncharts = new FusionCharts({
        type: 'radar',
        renderAt: props.attributes.id,
        width: chart.width || DEFAULT_CHART_DIMENSIONS.width,
        height: chart.height || DEFAULT_CHART_DIMENSIONS.height,
        dataFormat: 'json',
        dataSource
      });
      fusioncharts.render();
    });
  }

  render() {
    const { props } = this;
    if (!props.data) {
      return null;
    }
    return (
      <div id={props.attributes.id} style={{...props.attributes.style}}>
        {this.renderChart()}
      </div>
    );
  }
}

export default RadarChart;
