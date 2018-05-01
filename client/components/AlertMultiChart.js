import React, {PropTypes} from 'react';
import {formatDate} from '../../commons/utils/dateUtils';
import MultiSeriesLineChart from 'components/charts/MultiSeriesLineChart';
import MultiSeriesCombiChart from 'components/charts/MultiSeriesCombiChart';

const styles = {
  title: {
    'fontSize': '13px',
    'fontWeight': 600,
    'margin': 0,
    'paddingBottom': '10px'
  },
  wrap: {
    marginBottom: '35px'
  }
};

function getDataByIndex(data, index, label, callback) {
  return data.map((val) => {
    let value = val[index] === 'N/A' ? 0 : val[index];

    if (callback) {
      return {
        [label]: callback(value)
      };
    }
    return {
      [label]: value
    };
  });
}

function getFilteredRows(rows, filterIndex) {
  const filteredData = {};

  rows.forEach((row) => {
    const key = row[filterIndex];
    if (!filteredData.hasOwnProperty(key)) {
      filteredData[key] = [];
    }

    filteredData[key].push(row);
  });

  return filteredData;
}

class AlertMultiChart extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    duration: PropTypes.object,
    chart: PropTypes.object,
    attributes: PropTypes.object
  }

  getData(rows, columns) {
    const {duration} = this.props;

    let x, y = [];
    let filterIndex = -1;
    columns.forEach((col, index) => {
      if (col.name === 'date') {
        x = index;
      }
      else if (col.columnType === 'MEASURE' || col.columnType === 'FORMULA') {
        y.push({
          index,
          seriesname: col.displayName
        });
      }
      else if (col.columnType === 'DIMENSION' && col.dataType !== 'DATE') {
        filterIndex = index;
      }
    });

    let categories, dataset;

    if (filterIndex >= 0) {
      const filteredData = getFilteredRows(rows, filterIndex),
        keys = Object.keys(filteredData),
        yObj = y[0];

      categories = [{
        category: getDataByIndex(filteredData[keys[0]], x, 'label', val => (formatDate(val, duration)))
      }];

      dataset = keys.map(key => ({
        seriesname: key,
        data: getDataByIndex(filteredData[key], yObj.index, 'value')
      }));
    }
    else {
      categories = [{
        category: getDataByIndex(rows, x, 'label', val => (formatDate(val, duration)))
      }];

      dataset = y.map(yObj => ({
        seriesname: yObj.seriesname,
        data: getDataByIndex(rows, yObj.index, 'value')
      }));
    }

    const dataSource = {
      chart: this.props.chart.chartOptions,
      categories,
      dataset
    };

    return dataSource;
  }

  getCharts(data) {
    const charts = Object.keys(data);
    return charts.map(key => {
      const {rows, columns, uiConfig} = data[key],
        props = {...this.props};

      props.attributes = Object.assign({}, props.attributes, {id: key});
      if (rows.length !== 0) {
        props.normalizeData = this.getData(rows, columns);
        return (
          <div style={styles.wrap} key={key}>
            <h2 style={styles.title}>{uiConfig.title}</h2>
            <MultiSeriesLineChart {...props} />
          </div>
        );
      }
      else {
        return null;
      }
    });
  }

  getAnomalyChart(input) {
    let {attributes} = this.props;

    return Object.keys(input).map((chart, index) => {
      if (!chart) return null;

      const id = `chart${index}`,
        props = {
          attributes: {
            id,
            ...attributes.chart
          },
          processedData: true
        };

      const chartData = input[chart],
        uiConfig = chartData.uiConfig;

      chartData.chart = this.props.chart.chartOptions;
      chartData.chart.divlineThickness = 1;
      chartData.chart.xAxisName = uiConfig.xAxisLabel;
      chartData.chart.yAxisName = uiConfig.yAxisLabel;

      props.data = JSON.parse(JSON.stringify(chartData));
      delete props.data.uiConfig;

      return (
        <div style={styles.wrap} key={id}>
          <h2 style={styles.title}>{uiConfig.title}</h2>
          <MultiSeriesCombiChart {...props} />
        </div>
      );
    });
  }

  render() {
    let {data} = this.props;
    if (!data) return null;

    if (data.rows && !data.normalizeData) {
      let key = 'randomKey';
      try {
        key = data.options.body[0].uuid;
      }
      catch (ex) {}

      data = {[key]: data};
    }

    const tempData = Object.assign({}, data);
    delete tempData.options;

    let charts;
    if (data.normalizeData) {
      charts = this.getAnomalyChart(data.normalizeData);
    }
    else {
      charts = this.getCharts(tempData);
    }

    return (
      <div>
        {charts}
      </div>
    );
  }
}

AlertMultiChart.contextTypes = {
  store: React.PropTypes.object
};

export default AlertMultiChart;
