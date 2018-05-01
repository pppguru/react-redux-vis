import React from 'react';
import { mount, shallow } from 'enzyme';

import ParetoChart, {
  generateDataSource
} from 'components/charts/ParetoChart';
import {wrapThemeProvider} from '../../testUtils';

let props = {
  'chart': {
    'options': {
      'xAxisname': 'ANOMALY TYPES',
      'pYAxisname': 'ANOMALY COUNT',
      'paletteColors': '#03c5ed'
    },
    'data': {
      'fieldMapping': [
        {
          'reportId': 'taf_threat_trend',
          'columns': [
            'data.rank_alert.category'
          ],
          'axis': 'x'
        },
        {
          'reportId': 'taf_threat_trend',
          'columns': [
            'date'
          ],
          'axis': 'y'
        }
      ]
    },
    'width': '100%',
    'height': '350'
  },
  'meta': {},
  'attributes': {},
  'id': 'pareto-chart',
  'type': 'charts/ParetoChart'
};

function renderParetoChart(newProps = {}) {
  let updatedProps = Object.assign({}, props, newProps),
    component = shallow(wrapThemeProvider(<ParetoChart {...updatedProps} />));
  return component.find('ParetoChart');
}

function mountParetoChart(newProps) {
  let updatedProps = Object.assign({}, props, newProps),
    component = mount(<ParetoChart {...updatedProps} />);
  return component.find('ParetoChart');
}

describe('<ParetoChart />', () => {
  it('exists', () => {
    expect(ParetoChart).to.exist;
  });

  it('should have correct props', () => {
    const component = renderParetoChart();
    expect(component.props().id).to.be.defined;
    expect(component.props().id).to.equal('pareto-chart');
    expect(component.props().meta).to.be.defined;
    expect(component.props().meta).to.be.a('object');
    expect(component.props().attributes).to.be.defined;
    expect(component.props().attributes).to.be.a('object');
    expect(component.props().chart).to.be.defined;
    expect(component.props().chart).to.be.a('object');
    expect(component.props().chart.options).to.be.defined;
    expect(component.props().chart.options).to.be.a('object');
    expect(component.props().chart.data).to.be.defined;
    expect(component.props().chart.data).to.be.a('object');
    expect(component.props().chart.data.fieldMapping).to.be.defined;
    expect(component.props().chart.data.fieldMapping).to.be.an('array');
    expect(component.type()).to.equal(ParetoChart);
    expect(component.props().type).to.be.defined;
    expect(component.props().type).to.be.a('string');
  });

  it('should not load ParetoChart if API returns error with data undefined', () => {
    let component = mountParetoChart();
    expect(component.props().data).to.be.undefined;
    expect(component.find('div').text()).to.equal('');
  });

  it('should display message if API doesnot return data', () => {
    let newProps = {
        data: {
          rows: []
        }
      },
      component = mountParetoChart(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.props().data.rows).to.be.defined;
    expect(component.find('div').text()).to.equal('No Data Found.');
  });

  it('should load ParetoChart if API returns data', () => {
    let newProps = {
        data: {
          rows: [
            ['bad-reputation-traffic', 23859],
            ['non-standard-server', 89]
          ]
        }
      },
      component = mountParetoChart(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.type()).to.equal(ParetoChart);
  });

  it('should generate chart data source', () => {
    let newProps = {
        data: {
          'columns': [
            {
              'name': 'data.rank_alert.category',
              'displayName': 'Category',
              'columnType': 'DIMENSION',
              'dataType': 'TEXT',
              'sortable': true,
              'detailsAvailable': true,
              'hidden': false,
              'label': 'Category'
            },
            {
              'name': 'date',
              'displayName': 'count of alerts',
              'columnType': 'MEASURE',
              'dataType': 'NUMBER',
              'sortable': true,
              'detailsAvailable': false,
              'hidden': false
            }
          ],
          rows: [
            ['bad-reputation-traffic', 23859],
            ['non-standard-server', 89]
          ]
        }
      },
      component = mountParetoChart(newProps),
      dataSource = generateDataSource(component.props().data, component.props().chart);

    expect(dataSource.chart).to.be.defined;
    expect(dataSource.chart).to.be.a('object');
    expect(dataSource.data).to.be.defined;
    expect(dataSource.data).to.be.an('array');
    expect(dataSource.data).to.to.have.length(2);
  });

  it('should display chart labels as slanted if rows length is greater than the count specified in layout json', () => {
    props.chart = Object.assign({}, props.chart, {
      specificOptions: {
        displayLabelAs: {
          slanted: true,
          afterCount: 3
        }
      }
    });
    let newProps = {
        data: {
          'columns': [
            {
              'name': 'data.rank_alert.category',
              'displayName': 'Category',
              'columnType': 'DIMENSION',
              'dataType': 'TEXT',
              'sortable': true,
              'detailsAvailable': true,
              'hidden': false,
              'label': 'Category'
            },
            {
              'name': 'date',
              'displayName': 'count of alerts',
              'columnType': 'MEASURE',
              'dataType': 'NUMBER',
              'sortable': true,
              'detailsAvailable': false,
              'hidden': false
            }
          ],
          rows: [
            ['bad-reputation-traffic', 23859],
            ['non-standard-server', 89],
            ['malware', 27],
            ['ssh', 45]
          ]
        }
      },
      component = mountParetoChart(newProps),
      dataSource = generateDataSource(component.props().data, component.props().chart);
    expect(dataSource.chart).to.be.defined;
    expect(dataSource.chart).to.be.a('object');
    expect(dataSource.chart.labelDisplay).to.equal('rotate');
  });
});
