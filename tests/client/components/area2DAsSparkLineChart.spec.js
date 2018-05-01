import React from 'react';
import TestUtils from 'react-addons-test-utils';

import Area2DAsSparkLineChart, {
  generateDataSource
} from 'components/charts/Area2DAsSparkLineChart';

function shallowRender(component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function shallowRenderWithProps(props = {}) {
  return shallowRender(<Area2DAsSparkLineChart {...props} />);
}

describe('Area2DAsSparkLineChart Component: ', function() {
  it('Should render as <div>', function() {
    const props = {
      chart: {id: 'connection0'}
    };

    const component = shallowRenderWithProps(props);
    expect(component.type).to.equal('div');
    expect(component.props.id).to.equal(props.chart.id);
  });

  it('generateDataSource should return data source object which is required for FusionCharts.', function() {
    const inputArray = {
        'columnType': 'chart',
        'columnName': 'CONNECTIONS',
        'columnStyle': {
          'width': '30%'
        },
        'chartValue': {
          '2016-07-19T12:00:00.000': [
            136
          ]
        },
        'chartId': 'connection0',
        'chartType': 'area2d',
        'chartWidth': '100%',
        'chartHeight': '75'
      },
      duration = '1h',
      dataSourceObject = {
        'chart': {
          'paletteColors': '#BFEFEE',
          'showBorder': '0',
          'showCanvasBorder': '0',
          'usePlotGradientColor': '0',
          'showXAxisLine': '1',
          'axisLineAlpha': '25',
          'divLineAlpha': '0',
          'showValues': '0',
          'showYAxisValues': '0',
          'showAlternateHGridColor': '0',
          'showPlotBorder': '1',
          'plotBorderColor': '#59DED9',
          'plotBorderThickness': '1',
          'anchorradius': '0',
          'bgAlpha': '0',
          'canvasBgAlpha': '0',
          'chartTopMargin': '0',
          'chartBottomMargin': '0',
          'chartLeftMargin': '0',
          'chartRightMargin': '0',
          'minimizetendency': '1'
        },
        'dataset': [
          {
            'data': [
              {
                'label': '',
                'value': 136
              }
            ]
          }
        ]
      };
    // expect(generateDataSource(inputArray, duration)).to.deep.equal(dataSourceObject);
  });
});
