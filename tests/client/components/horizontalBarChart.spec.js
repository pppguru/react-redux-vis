import React from 'react';
import TestUtils from 'react-addons-test-utils';
import HorizontalBarChart, { generateDataArray } from 'components/charts/HorizontalBarChart';

function shallowRender(component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function shallowRenderWithProps(props = {}) {
  return shallowRender(<HorizontalBarChart {...props} />);
}

describe('HorizontalBarChart Component: ', function() {
  it('Should render as <div>', function() {
    const props = {
      'attributes': {'id': 'TopConnectionsByProtocol'},
      'meta': {
        'title': 'Top Connections By Protocol'
      },
      'data': null
    };

    const component = shallowRenderWithProps(props);
    expect(component.type).to.equal('div');
  });

  it('generateDataArray should return data array.', function() {
    const columnIndexArray = [3, 5],
      rowsArray = [
        [
          'CN',
          '1681.14',
          '479.81',
          'China',
          553,
          1731585
        ],
        [
          'BR',
          '713.87',
          '796.72',
          'Brazil',
          23,
          80150
        ]
      ],
      orgDataset = [
        {
          'label': 'China',
          'value': 93296,
          'connection': 'malicious',
          'toolText': 'China, 93296'
        },
        {
          'label': 'Brazil',
          'value': 79960,
          'connection': 'malicious',
          'toolText': 'Brazil, 79960'
        }
      ],
      displayTopFive = true,
      connection = 'secure',
      dataArray = {
        'dataset': [],
        'annotationItems': [],
        'secureConnectionsValues': [],
        'maliciousConnectionsValues': []
      };
    let parameters = {
      columnIndexArray: columnIndexArray,
      rowsArray: rowsArray,
      displayTopFive: displayTopFive,
      orgDataset: orgDataset,
      connection: connection,
      numberSuffix: '',
      singleLineCharacters: '15'
    };
    expect(
      generateDataArray(parameters)
    ).to.deep.equal(dataArray);
  });
});
