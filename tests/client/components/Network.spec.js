import React from 'react';

import { createRenderer } from 'react-addons-test-utils';

import { mount, shallow } from 'enzyme';
import {spy} from 'sinon';

import NetworkGraph, { generateDataFromAssetDetails } from 'components/networkGraph';
import Loader from 'components/Loader';
import {wrapThemeProvider} from '../../testUtils';

let props = {
  id: 'NetworkGraph',
  data: null,
  params: {
    date: '2016-11-21T12:23:22.222'
  },
  'attributes': {
    'style': {
      'width': '100%'
    },
    'canvasStyle': {
      'height': '600px',
      'width': '100%'
    },
    'id': 'NetworkGraph'
  },
  fetchApiData: spy()
};

function renderNetworkGraph() {
  let component = shallow(wrapThemeProvider(<NetworkGraph {...props} />));
  return component.find('NetworkGraph');
}

function mountNetworkGraph(isFetching) {
  let props = {
    id: 'NetworkGraph',
    isFetching,
    data: null,
    params: {
      date: '2016-11-21T12:23:22.222'
    },
    'attributes': {
      'style': {
        'width': '100%'
      },
      'canvasStyle': {
        'height': '600px',
        'width': '100%'
      },
      'id': 'NetworkGraph'
    },
    fetchApiData: spy()
  };
  return mount(<NetworkGraph {...props} />);
}

function mountNetworkGraphComponent() {
  let component = mount(<NetworkGraph {...props} />);
  return component.find('NetworkGraph');
}

function renderNetwork(isFetching) {
  let component,
    props = {
      id: 'NetworkGraph',
      isFetching,
      data: null,
      params: {
        date: '2016-11-21T12:23:22.222'
      },
      'attributes': {
        'style': {
          'width': '100%'
        },
        'canvasStyle': {
          'height': '600px',
          'width': '100%'
        },
        'id': 'NetworkGraph'
      },
      fetchApiData: spy()
    };

  let renderer = createRenderer();
  renderer.render(<NetworkGraph {...props} />);
  component = renderer.getRenderOutput();
  return {
    props,
    component,
    renderer
  };
}

describe('<NetworkGraph />', () => {
  it('exists', () => {
    expect(NetworkGraph).to.exist;
  });

  it('should have correct props', () => {
    const component = renderNetworkGraph();
    expect(component.props().id).to.be.defined;
    expect(component.props().id).to.equal('NetworkGraph');
    expect(component.type()).to.equal(NetworkGraph);
    expect(component.props().attributes).to.be.defined;
    expect(component.props().fetchApiData).to.exist;
    expect(component.props().fetchApiData).to.be.a('function');
  });

  it('should display asset node if it loads on asset page', () => {
    const component = renderNetworkGraph();
    expect(component.props().data).to.be.defined;
    expect(component.props().data).to.not.be.an('array');
    let data = {
        id: '192.168.2.11',
        type: 'user',
        info: {
          name: 'Root'
        }
      },
      nodes = [
        {
          id: '192.168.2.11',
          nodeId: '192.168.2.11',
          label: 'Root',
          type: 'user',
          metadata: {
            name: 'Root'
          }
        }
      ],
      graphObj = [
        {
          nodes,
          edges: []
        }
      ];

    expect(generateDataFromAssetDetails(data)).to.deep.equal(graphObj);
  });

  it('Should display loader', () => {
    const wrapper = mountNetworkGraph(true);
    wrapper.setState({ isFetching: true });
    expect(wrapper.find(Loader)).to.exist;
  });

  it('if edge type is ioc then, it should display as dash line', () => {

  });
});
