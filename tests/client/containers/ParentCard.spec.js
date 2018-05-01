import React from 'react';

import { mount, shallow } from 'enzyme';
import {spy} from 'sinon';

import {ParentCard} from 'containers/ParentCard';

function shallowRenderParentCard(propsOptions, contextOptions) {
  const child = <div>Hello World</div>;
  let props = {
    meta: {id: 'testId', api: null},
    history: {
      goBack: spy()
    },
    attributes: {},
    fetchApiData: spy(),
    updateRoute: spy(),
    removeComponent: spy(),
    broadcastEvent: spy(),
    fetchNextSetOfData: spy(),
    children: child
  };

  props = Object.assign({}, props, propsOptions);

  let context = {
    store: {
      subscribe: spy()
    }
  };

  let component = shallow(<ParentCard {...props} />, {context});
  return component;
}

function mountParentCard(propsOptions, contextOptions) {
  const child = <div>Hello World</div>;

  let props = {
    meta: {id: 'testId', api: null},
    history: {
      goBack: spy()
    },
    attributes: {},
    fetchApiData: spy(),
    updateRoute: spy(),
    removeComponent: spy(),
    broadcastEvent: spy(),
    fetchNextSetOfData: spy(),
    children: child
  };

  props = Object.assign({}, props, propsOptions);

  let context = {
    store: {
      subscribe: spy()
    }
  };

  let component = mount(<ParentCard {...props} />, {context});
  return component;
}

describe('<ParentCard />', () => {
  it('exists', () => {
    expect(ParentCard).to.exist;
  });

  it('has correct props', () => {
    const style = { color: 'red' },
      component = mountParentCard({ id: 'card', attributes: { style } });

    expect(component.type()).to.equal(ParentCard);
    expect(component.props().id).to.equal('card');
    expect(component.props().attributes.style).to.equal(style);
    expect(component.props().attributes).to.deep.equal({ style });
    expect(component.props().fetchApiData).to.exist;
    expect(component.props().fetchApiData).to.be.a('function');
    expect(component.props().updateRoute).to.exist;
    expect(component.props().updateRoute).to.be.a('function');
    expect(component.props().removeComponent).to.exist;
    expect(component.props().removeComponent).to.be.a('function');
    expect(component.props().broadcastEvent).to.exist;
    expect(component.props().broadcastEvent).to.be.a('function');
    expect(component.props().fetchNextSetOfData).to.exist;
    expect(component.props().fetchNextSetOfData).to.be.a('function');
  });

  it('renders correct children', () => {
    let component = shallowRenderParentCard({
      children: <div>Test</div>
    });

    expect(component.children().length).to.equal(1);
    expect(component.childAt(0).type()).to.equal('div');
    expect(component.childAt(0).text()).to.equal('Test');
  });

  it('calls fetchApiData when api is an Object or an array', () => {
    let component = mountParentCard({
      meta: {id: 'random', api: null}
    });
    expect(component.props().fetchApiData.callCount).to.equal(0);

    component = mountParentCard({
      meta: {
        id: 'random',
        api: {}
      }
    });
    expect(component.props().fetchApiData.callCount).to.equal(1);

    component = mountParentCard({
      meta: {
        id: 'random',
        api: []
      }
    });
    expect(component.props().fetchApiData.callCount).to.equal(1);

    // component = mountParentCard({
    //   meta: {
    //     id: 'random',
    //     api: {
    //       'path': '/api/analytics/reporting/execute/{reportId}',
    //       'queryParams': {
    //         'window': '',
    //         'count': 10,
    //         'from': 0
    //       },
    //       'pathParams': {
    //         'reportId': 'taf_alert_by_asset'
    //       }
    //     }
    //   }
    // });
    // expect(component.props().fetchApiData.callCount).to.equal(1);
  });
});
