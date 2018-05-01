import React from 'react';
import { mount, shallow } from 'enzyme';
import {generateRawData} from '../../../commons/utils/utils';
import WorldMap, {
  generateDataSource
} from 'components/maps/WorldMap';
import NoDataWidget from 'components/widgets/NoDataWidget';
import {wrapThemeProvider} from '../../testUtils';
import {spy} from 'sinon';

let columns = [
  {
    'name': 'source.country',
    'displayName': 'Source Country',
    'columnType': 'DIMENSION',
    'sortable': true,
    'detailsAvailable': true,
    'hidden': false,
    'label': 'Source Country'
  },
  {
    'name': 'pos_x',
    'displayName': 'pos_x',
    'columnType': 'DIMENSION',
    'sortable': true,
    'detailsAvailable': false,
    'hidden': false
  },
  {
    'name': 'pos_y',
    'displayName': 'pos_y',
    'columnType': 'DIMENSION',
    'sortable': true,
    'detailsAvailable': false,
    'hidden': false
  },
  {
    'name': 'country_name',
    'displayName': 'country_name',
    'columnType': 'DIMENSION',
    'sortable': true,
    'detailsAvailable': false,
    'hidden': false
  },
  {
    'name': 'connections',
    'displayName': 'connections',
    'columnType': 'MEASURE',
    'sortable': true,
    'detailsAvailable': false,
    'hidden': false
  }],
  props = {
    'chart': {
      'options': {},
      'data': {
        'fieldMapping': [
          {
            'reportId': 'taf_dest_countries',
            'columns': {
              'country': 'destination.country',
              'x': 'pos_x',
              'y': 'pos_y',
              'connections': 'connections'
            },
            'connection': 'secure'
          },
          {
            'reportId': 'taf_dest_bad_reputation_countries',
            'columns': {
              'country': 'destination.country',
              'x': 'pos_x',
              'y': 'pos_y',
              'connections': 'connections'
            },
            'connection': 'malicious'
          }
        ]
      },
      'width': '100%',
      'height': '350'
    },
    'meta': {},
    'attributes': {
      'legendStyle': {
        'width': '10%',
        'marginLeft': '-10%'
      }
    },
    'id': 'world-map',
    'type': 'maps/WorldMap'
  },
  data = {
    'data': {
      'taf_dest_countries': {
        columns,
        'rows': [
          ['CN', 1, 1681.14, 479.81, 'China', 44904, 146829733],
          ['CA', 1, 1681.14, 479.81, 'Canada', 44904, 146829733]
        ]
      },
      'taf_dest_bad_reputation_countries': {
        columns,
        'rows': [
          ['CN', 1, 1681.14, 479.81, 'China', 44904, 146829733],
          ['CA', 1, 1681.14, 479.81, 'Canada', 44904, 146829733]
        ]
      }
    }
  };

function renderWorldMap(newProps = {}) {
  let updatedProps = Object.assign({}, props, newProps),
    component = shallow(wrapThemeProvider(<WorldMap {...updatedProps} />));
  // Here, 'wrapThemeProvider' is required, otherwise it is giving following error:
  // Error : Method “props” is only meant to be run on a single node. 0 found instead.
  return component.find('WorldMap');
}

function mountWorldMap(newProps) {
  let updatedProps = Object.assign({}, props, newProps),
    component = mount(<WorldMap {...updatedProps} />);
  return component.find('WorldMap');
}

describe('<WorldMap />', () => {
  it('exists', () => {
    expect(WorldMap).to.exist;
  });

  it('should have correct props', () => {
    const component = renderWorldMap();
    expect(component.props().id).to.be.defined;
    expect(component.props().id).to.equal('world-map');
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
    expect(component.props().chart.data.fieldMapping[0].columns).to.be.defined;
    expect(component.props().chart.data.fieldMapping[0].columns).to.be.a('object');
    expect(component.type()).to.equal(WorldMap);
    expect(component.props().type).to.be.defined;
    expect(component.props().type).to.be.a('string');
  });

  it('should not load WorldMap if API returns error with data undefined', () => {
    let component = mountWorldMap({});
    expect(component.props().data).to.be.undefined;
    expect(component.find('div').text()).to.equal('');
  });

  it('should display message if API doesnot return data', () => {
    let newProps = {
        data: {
          taf_dest_countries: {
            columns,
            rows: []
          },
          taf_dest_bad_reputation_countries: {
            columns,
            rows: []
          }
        }
      },
      component = mountWorldMap(newProps),
      reportId1 = component.props().chart.data.fieldMapping[0].reportId,
      reportId2 = component.props().chart.data.fieldMapping[1].reportId;

    expect(component.props().data).to.be.defined;
    expect(reportId1).to.be.defined;
    expect(reportId2).to.be.defined;
    expect(component.props().data[reportId1].rows).to.be.defined;
    expect(component.props().data[reportId2].rows).to.be.defined;
    expect(component.props().data[reportId1].rows).to.have.length(0);
    expect(component.props().data[reportId2].rows).to.have.length(0);
    expect(NoDataWidget).to.exist;
  });

  it('should load WorldMap if API returns data', () => {
    FusionCharts.ready = spy();
    let newProps = data,
      component = mountWorldMap(newProps);
    expect(component.props().data).to.be.defined;
    expect(component.type()).to.equal(WorldMap);
    expect(FusionCharts.ready.callCount).to.equal(1);
  });

  context('generateDataSource function', function() {
    it('should return correct dataSource object', () => {
      const newProps = data,
        component = mountWorldMap(newProps),
        rawData = generateRawData(component.props().chart.data.fieldMapping, component.props().data),
        dataSource = generateDataSource(rawData, component.props().chart);
      expect(dataSource).to.be.a('object');
      expect(dataSource.chart).to.be.defined;
      expect(dataSource.data).to.be.defined;
      expect(dataSource.data[0].data).to.be.defined;
      expect(dataSource.data[0].data).to.be.an('array');
      expect(dataSource.data[0].data).to.have.length(4);
    });

    it('should return empty dataSource object if API returns N/A', () => {
      const newProps = {
          data: {
            taf_dest_countries: {
              columns,
              rows: [
                ['CN', 'N/A', 'N/A', 'N/A', 'China', 'N/A', 'N/A'],
                ['CA', 'N/A', 'N/A', 'N/A', 'Canada', 'N/A', 'N/A']
              ]
            },
            taf_dest_bad_reputation_countries: {
              columns,
              rows: [
                ['CN', 'N/A', 'N/A', 'N/A', 'China', 'N/A', 'N/A'],
                ['CA', 'N/A', 'N/A', 'N/A', 'Canada', 'N/A', 'N/A']
              ]
            }
          }
        },
        component = mountWorldMap(newProps),
        rawData = generateRawData(component.props().chart.data.fieldMapping, component.props().data),
        dataSource = generateDataSource(rawData, component.props().chart);
      expect(dataSource).to.be.a('object');
      expect(dataSource.chart).to.be.defined;
      expect(dataSource.data).to.be.defined;
      expect(dataSource.data[0].data).to.be.defined;
      expect(dataSource.data[0].data).to.be.an('array');
      expect(dataSource.data[0].data).to.have.length(0);
    });

    it('should return empty dataSource object if connection object is specified other than "secure" or "malicious" in layout json', () => {
      const chart = {
          'chart': {
            'options': {},
            'data': {
              'fieldMapping': [
                {
                  'reportId': 'taf_dest_countries',
                  'columns': {
                    'country': 'destination.country',
                    'x': 'pos_x',
                    'y': 'pos_y',
                    'connections': 'connections'
                  },
                  'connection': 'taf'
                },
                {
                  'reportId': 'taf_dest_bad_reputation_countries',
                  'columns': {
                    'country': 'destination.country',
                    'x': 'pos_x',
                    'y': 'pos_y',
                    'connections': 'connections'
                  },
                  'connection': 'dashboard'
                }
              ]
            },
            'width': '100%',
            'height': '350'
          }
        },
        newProps = Object.assign({}, data, chart),
        component = mountWorldMap(newProps),
        rawData = generateRawData(component.props().chart.data.fieldMapping, component.props().data),
        dataSource = generateDataSource(rawData, component.props().chart);
      expect(dataSource).to.be.a('object');
      expect(dataSource.chart).to.be.defined;
      expect(dataSource.data).to.be.defined;
      expect(dataSource.data[0].data).to.be.defined;
      expect(dataSource.data[0].data).to.be.an('array');
      expect(dataSource.data[0].data).to.have.length(0);
    });

    it('should return empty dataSource object if API returns empty columns array', () => {
      const newProps = {
          data: {
            taf_dest_countries: {
              columns: [],
              rows: [
                ['CA', 1, 1681.14, 479.81, 'Canada', 44904, 146829733]
              ]
            },
            taf_dest_bad_reputation_countries: {
              columns: [],
              rows: [
                ['CA', 1, 1681.14, 479.81, 'Canada', 44904, 146829733]
              ]
            }
          }
        },
        component = mountWorldMap(newProps),
        rawData = generateRawData(component.props().chart.data.fieldMapping, component.props().data),
        dataSource = generateDataSource(rawData, component.props().chart);
      expect(dataSource).to.be.a('object');
      expect(dataSource.chart).to.be.defined;
      expect(dataSource.data).to.be.defined;
      expect(dataSource.data[0].data).to.be.defined;
      expect(dataSource.data[0].data).to.be.an('array');
      expect(dataSource.data[0].data).to.have.length(0);
    });
  });
});
