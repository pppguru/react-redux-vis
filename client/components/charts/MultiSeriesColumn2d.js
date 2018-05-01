import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import { DEFAULT_FONT, DEFAULT_CHART_DIMENSIONS } from 'Constants';

const chart = {
  baseFont: DEFAULT_FONT,
  baseFontColor: '#333333',
  showBorder: '0',
  bgColor: '#ffffff',
  showShadow: '0',
  canvasBgColor: '#ffffff',
  canvasBorderAlpha: '0',
  divLineAlpha: '50',
  divLineColor: Colors.cloud,
  divLineThickness: '1',
  usePlotGradientColor: '0',
  showplotborder: '0',
  valueFontColor: '#ffffff',
  showHoverEffect: '1',
  rotateValues: '1',
  showXAxisLine: '1',
  xAxisLineThickness: '1',
  xAxisLineColor: '#999999',
  showAlternateHGridColor: '0',
  showValues: '0',
  legendBgAlpha: '0',
  legendBorderAlpha: '0',
  legendShadow: '0',
  legendItemFontSize: '10',
  legendItemFontColor: '#666666',
  labelDisplay: 'wrap',
  rotateLabels: '1',
  slantLabels: '1',
  toolTipSepChar: ' | '
};

function getColumnIndex(columns, type) {
  let index = null, col = null;
  columns.forEach((column, i) => {
    if (column.columnType === type) {
      index = i;
      col = column;
      return;
    }
  });

  return {index, col};
}

function getData(data, index, label, callback) {
  return data.map((val) => {
    if (callback) {
      return {
        [label]: callback(val[index])
      };
    }
    return {
      [label]: val[index]
    };
  });
}

function getDataSource(props) {
  let {data, chart: {data: {fieldMapping}}} = props;

  let xAxis, yAxis = [];
  fieldMapping.forEach(field => {
    if (field.axis === 'x') {
      xAxis = {...getColumnIndex(data.columns, field.columns[0].columnType), field};
    }

    if (field.axis === 'y') {
      yAxis.push({...getColumnIndex(data.columns, field.columns[0].columnType), field});
    }
  });

  const categories = [],
    dataset = [];

  const {rows} = data;

  categories.push({
    category: getData(rows, xAxis.index, 'label')
  });

  yAxis.forEach(y => {
    const {index, field, field: {columns}} = y;

    dataset.push({
      seriesname: field.seriesname,
      data: getData(rows, index, 'value', (val) => (val[columns[0].key]))
    });
  });

  return {
    chart: Object.assign({}, chart, props.chart.options),
    categories,
    dataset
  };
}

class MultiSeriesColumn2d extends React.Component {
  static propTypes = {
    attributes: PropTypes.object,
    meta: PropTypes.object,
    id: PropTypes.string,
    params: PropTypes.object,
    fetchApiData: PropTypes.func
  }

  componentDidMount() {
    // TODO remove this special case.
    function getApiObj(params) {
      let reportId;
      if (params.type === 'user') {
        reportId = 'taf_asset_logins_by_user_on_machines';
      }
      else {
        reportId = 'taf_asset_logins_on_machine_by_users';
      }

      return [
        {
          path: '/api/analytics/reporting/execute/{reportId}',
          pathParams: {
            reportId: `${reportId}`
          },
          queryParams: {
            window: '',
            user: 'assetId:pathParam',
            status: 'success'
          },
          id: 'success'
        },
        {
          path: '/api/analytics/reporting/execute/{reportId}',
          pathParams: {
            reportId: `${reportId}`
          },
          queryParams: {
            window: '',
            user: 'assetId:pathParam',
            status: 'fail'
          },
          id: 'fail'
        }
      ];
    }

    const {props: {meta: {api}, id, fetchApiData, params}} = this;

    if (api === null) {
      fetchApiData({id, api: getApiObj(params), params});
    }
  }

  renderChart(props) {
    if (!props.data) {
      return;
    }

    const {chart} = props;

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: 'mscolumn2d',
        renderAt: props.attributes.id,
        width: chart.width || DEFAULT_CHART_DIMENSIONS.width,
        height: chart.height || DEFAULT_CHART_DIMENSIONS.height,
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource: getDataSource(props)
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

export default MultiSeriesColumn2d;
