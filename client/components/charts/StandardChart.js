import React, {PropTypes} from 'react';
import { Colors, StandardChartPalette } from '../../../commons/colors';
import {
  getIndexFromColumnName,
  isEmpty,
  isValidDate,
  getDateTimeInLocalTimeZone
} from '../../../commons/utils/utils';
import { calculateDateDisplayFormat } from '../../../commons/utils/dateUtils';
import {
  DEFAULT_FONT,
  DEFAULT_CHART_OPTIONS,
  DEFAULT_CHART_DIMENSIONS
} from 'Constants';
import NoDataWidget from '../widgets/NoDataWidget';

const chartOptions = Object.assign({}, DEFAULT_CHART_OPTIONS, {
  labelFontSize: '11',
  showAxisLines: '1',
  showLabels: '1',
  showPercentInTooltip: '1',
  showValues: '0',
  showYAxisValues: '1',
  theme: 'zune',
  xAxisNameFontSize: '13',
  yAxisNameFontSize: '13',
  xAxisNamePadding: '20',
  yAxisNamePadding: '20',
  lineColor: Colors.coral,
  showXAxisLine: '0',
  showYAxisLine: '0',
  divLineIsDashed: '0',
  showsYAxisLine: '0',
  divLineAlpha: '20',
  chartLeftMargin: '0',
  chartRightMargin: '0',
  chartBottomMargin: '0',
  numDivLines: '6',
  baseFont: DEFAULT_FONT,
  baseFontColor: Colors.pebble,
  paletteColors: StandardChartPalette,
  decimals: '2',
  labelDisplay: 'wrap',
  slantLabels: '1',
  toolTipSepChar: ' | '
});

export function generateDataSource(data, chart, duration) {
  const {options, specificOptions, data: {fieldMapping}} = chart,
    graphBars = [],
    {rows, columns} = data;

  let x, y;

  fieldMapping.forEach((field) => {
    // Check for x-axis chart data
    if (field.axis === 'x') {
      // Calculate column index from API response
      x = getIndexFromColumnName(field.columns, columns);
    }

    // Check for y-axis chart data
    if (field.axis === 'y') {
      // Calculate column index from API response
      y = getIndexFromColumnName(field.columns, columns);
    }
  });

  rows.forEach((row) => {
    let xValue = row[x],
      yValue = row[y];

    if (isValidDate(xValue)) {
      let dateDisplayFormat = calculateDateDisplayFormat(duration);
      xValue = getDateTimeInLocalTimeZone(xValue, dateDisplayFormat);
    }

    let barObject = {
      label: xValue || 'Other',
      value: yValue
    };

    graphBars.push(barObject);
  });

  if (specificOptions &&
    specificOptions.displayLabelAs &&
    specificOptions.displayLabelAs.slanted &&
    specificOptions.displayLabelAs.afterCount < rows.length) {
    options.labelDisplay = 'rotate';
  }
  else {
    options.labelDisplay = 'wrap';
  }

  return {
    chart: Object.assign({}, chartOptions, options),
    data: graphBars
  };
};

class StandardChart extends React.Component {
  static propTypes = {
    attributes: PropTypes.object.isRequired,
    data: PropTypes.object,
    chart: PropTypes.object.isRequired,
    duration: PropTypes.object
  }

  renderChart() {
    const {props: {data, chart, duration, attributes}} = this;

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: chart.type,
        renderAt: attributes.id,
        width: chart.width ? chart.width : DEFAULT_CHART_DIMENSIONS.width,
        height: chart.height ? chart.height : DEFAULT_CHART_DIMENSIONS.height,
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource: generateDataSource(data, chart, duration)
      });
      fusioncharts.render();
    });
  }

  render() {
    const {props} = this;

    if (!props.data) {
      return (<div />);
    }

    if (isEmpty(props.data.rows)) {
      return (<NoDataWidget />);
    }

    return (
      <div id={props.attributes.id}>{this.renderChart()}</div>
    );
  }
}

export default StandardChart;
