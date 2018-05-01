import React from 'react';
import { mount, shallow } from 'enzyme';

import ScatterChart, {
  generateDataSource
} from 'components/charts/ScatterChart';
import {wrapThemeProvider} from '../../testUtils';
import {spy} from 'sinon';

let props = {
  'chart': {
    'options': {
      'xAxisname': 'x axis name',
      'pYAxisname': 'y axis name'
    },
    'width': '100%',
    'height': '350'
  },
  'meta': {},
  'attributes': {
    'id': 'user-agent-chart'
  },
  'id': 'scatter-chart',
  'type': 'charts/ScatterChart'
};

function renderScatterChart(newProps = {}) {
  let updatedProps = Object.assign({}, props, newProps),
    component = shallow(wrapThemeProvider(<ScatterChart {...updatedProps} />));
  // Here, 'wrapThemeProvider' is required, otherwise it is giving following error:
  // Error : Method “props” is only meant to be run on a single node. 0 found instead.
  return component.find('ScatterChart');
}

function mountScatterChart(newProps) {
  let updatedProps = Object.assign({}, props, newProps),
    component = mount(<ScatterChart {...updatedProps} />);
  return component.find('ScatterChart');
}

describe('<ScatterChart />', () => {
  it('exists', () => {
    expect(ScatterChart).to.exist;
  });

  it('should have correct props', () => {
    const component = renderScatterChart();
    expect(component.props().id).to.be.defined;
    expect(component.props().id).to.equal('scatter-chart');
    expect(component.props().meta).to.be.defined;
    expect(component.props().meta).to.be.a('object');
    expect(component.props().attributes).to.be.defined;
    expect(component.props().attributes).to.be.a('object');
    expect(component.props().chart).to.be.defined;
    expect(component.props().chart).to.be.a('object');
    expect(component.props().chart.options).to.be.defined;
    expect(component.props().chart.options).to.be.a('object');
    expect(component.type()).to.equal(ScatterChart);
    expect(component.props().type).to.be.defined;
    expect(component.props().type).to.be.a('string');
  });

  it('should not load ScatterChart if API returns error with data undefined', () => {
    let component = mountScatterChart();
    expect(component.props().data).to.be.undefined;
    expect(component.find('div').text()).to.equal('');
  });

  it('should display message if API doesnot return data', () => {
    let newProps = {
        data: {
          normalizeData: []
        }
      },
      component = mountScatterChart(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.props().data.rows).to.be.defined;
    expect(component.find('div').text()).to.equal('No Data Found.');
  });

  it('should load ScatterChart if API returns data', () => {
    FusionCharts.ready = spy();
    let newProps = {
        data: {
          normalizeData: [
            {
              '30': {
                'Jakarta Commons-HttpClient/3.1': [
                  7
                ]
              }
            }
          ]
        }
      },
      component = mountScatterChart(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.props().data.normalizeData).to.be.defined;
    expect(component.props().data.normalizeData).to.to.have.length(1);
    expect(component.type()).to.equal(ScatterChart);
    expect(FusionCharts.ready.callCount).to.equal(1);
  });

  context('generateDataSource function', function() {
    it('should generate chart data source', () => {
      let newProps = {
          data: {
            normalizeData: [
              {
                '23': {
                  'Python-urllib/3.4': [
                    67
                  ]
                }
              },
              {
                '30': {
                  'Jakarta Commons-HttpClient/3.1': [
                    7
                  ]
                }
              }
            ]
          }
        },
        component = mountScatterChart(newProps),
        dataSource = generateDataSource(component.props().data.normalizeData, component.props().chart);

      expect(dataSource.chart).to.be.defined;
      expect(dataSource.chart).to.be.a('object');
      expect(dataSource.dataset).to.be.defined;
      expect(dataSource.dataset).to.be.an('array');
      expect(dataSource.dataset).to.to.have.length(2);
    });
  });
});
