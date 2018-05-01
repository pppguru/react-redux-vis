import React from 'react';
import { mount, shallow } from 'enzyme';

import StandardChart, {
  generateDataSource
} from 'components/charts/StandardChart';
import {wrapThemeProvider} from '../../testUtils';
import {getDateTimeInLocalTimeZone} from '../../../commons/utils/utils';
import {calculateDateDisplayFormat} from '../../../commons/utils/dateUtils';

let props = {
  'chart': {
    'options': {
      'xAxisname': 'TYPES',
      'pYAxisname': 'COUNT',
      'paletteColors': '#03c5ed'
    },
    'data': {
      'fieldMapping': [
        {
          'reportId': 'reportId',
          'columns': [
            'data.rank_alert.category'
          ],
          'axis': 'x'
        },
        {
          'reportId': 'reportId',
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
  'attributes': {
    'id': 'standard-chart'
  },
  'duration': '1mo',
  'id': 'standard-chart',
  'type': 'charts/StandardChart'
};

function renderStandardChart(newProps = {}) {
  let updatedProps = Object.assign({}, props, newProps),
    component = shallow(wrapThemeProvider(<StandardChart {...updatedProps} />));
  return component.find('StandardChart');
}

function mountStandardChart(newProps) {
  let updatedProps = Object.assign({}, props, newProps),
    component = mount(<StandardChart {...updatedProps} />);
  return component.find('StandardChart');
}

describe('<StandardChart />', () => {
  it('exists', () => {
    expect(StandardChart).to.exist;
  });

  it('should have correct props', () => {
    const component = renderStandardChart();
    expect(component.props().id).to.be.defined;
    expect(component.props().id).to.equal('standard-chart');
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
    expect(component.type()).to.equal(StandardChart);
    expect(component.props().type).to.be.defined;
    expect(component.props().type).to.be.a('string');
  });

  it('should not load StandardChart if API returns error with data undefined', () => {
    let component = mountStandardChart();
    expect(component.props().data).to.be.undefined;
    expect(component.find('div').text()).to.equal('');
  });

  it('should display message if API doesnot return data', () => {
    let newProps = {
        data: {
          rows: []
        }
      },
      component = mountStandardChart(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.props().data.rows).to.be.defined;
    expect(component.find('div').text()).to.equal('No Data Found.');
  });

  it('should load StandardChart if API returns data', () => {
    let newProps = {
        data: {
          rows: [
            ['bad-reputation-traffic', 23859],
            ['non-standard-server', 89]
          ]
        }
      },
      component = mountStandardChart(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.type()).to.equal(StandardChart);
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
      component = mountStandardChart(newProps),
      dataSource = generateDataSource(component.props().data, component.props().chart);

    expect(dataSource.chart).to.be.defined;
    expect(dataSource.chart).to.be.a('object');
    expect(dataSource.data).to.be.defined;
    expect(dataSource.data).to.be.an('array');
    expect(dataSource.data).to.to.have.length(2);
  });

  it('should display formatted date as x-axis label', () => {
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
            ['2017-03-24T00:00:00.000', 23859],
            ['2017-03-24T00:00:00.000', 89]
          ]
        }
      },
      component = mountStandardChart(newProps),
      dataSource = generateDataSource(component.props().data, component.props().chart),
      dateFormat = calculateDateDisplayFormat(newProps.duration),
      localDate = getDateTimeInLocalTimeZone(newProps.data.rows[0][0], dateFormat);

    expect(dataSource.chart).to.be.defined;
    expect(dataSource.chart).to.be.a('object');
    expect(dataSource.data).to.be.defined;
    expect(dataSource.data).to.be.an('array');
    expect(dataSource.data[0].label).to.equal(localDate);
    expect(dataSource.data).to.to.have.length(2);
  });

  it('should display "Other" as x-axis label if its index is undefined', () => {
    let newProps = {
        data: {
          'columns': [
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
            ['test1', 23859],
            ['test2', 89]
          ]
        }
      },
      component = mountStandardChart(newProps),
      dataSource = generateDataSource(component.props().data, component.props().chart);

    expect(dataSource.chart).to.be.defined;
    expect(dataSource.chart).to.be.a('object');
    expect(dataSource.data).to.be.defined;
    expect(dataSource.data).to.be.an('array');
    expect(dataSource.data[0].label).to.equal('Other');
    expect(dataSource.data).to.to.have.length(2);
  });
});
