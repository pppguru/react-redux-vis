import React from 'react';

import { mount, shallow } from 'enzyme';
import {spy} from 'sinon';

import Heatmap from 'components/charts/Heatmap';

function getProps(prop) {
  const props = Object.assign({
    attributes: {
      id: 'heatmap',
      style: {
        color: '#000'
      }
    },
    data: null
  }, prop);

  return props;
}

function getShallowComponent(prop) {
  const props = getProps(prop);
  return shallow(<Heatmap {...props} />);
}

function getMountComponent(prop) {
  const props = getProps(prop);

  let component = mount(<Heatmap {...props} />);
  component = component.find('Heatmap');
  return component;
}

describe('<Heatmap />', function() {
  it('should exist', () => {
    expect(Heatmap).to.exist;
  });

  it('should have type null', () => {
    const component = getShallowComponent();
    expect(component.type()).to.equal(null);
  });

  it('should have id of heatmap', () => {
    const component = getShallowComponent({data: {}});
    expect(component.props().id).to.equal('heatmap');
  });

  it('should have data prop with rows and columns', () => {
    FusionCharts.ready = spy();

    let component = getMountComponent({data: {
      rows: [1, 2, 3],
      columns: []
    }});

    expect(FusionCharts.ready.callCount).to.equal(1);
    expect(component.props().data).to.be.defined;
    expect(component.props().data).to.be.an('object');
    expect(component.props().data).to.have.property('rows');
    expect(component.props().data).to.have.property('columns');
  });
});
