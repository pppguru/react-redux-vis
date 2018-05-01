import React from 'react';

import {
  createRenderer
} from 'react-addons-test-utils';

import injectTapEventPlugin from 'react-tap-event-plugin';
import {PageHeader} from 'layouts/CoreLayout/PageHeader';

import { mount, shallow } from 'enzyme';
import {spy} from 'sinon';

import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import Paper from 'material-ui/Paper';

import { simulateEvent } from '../../../testUtils';

injectTapEventPlugin();

function setupPageHeader(auth = {user: null}, showKibana = false, enzymeFlag = false) {
  const props = {
    title: 'rank',
    auth,
    showKibana,
    hideKibana: spy(),
    logout: spy(),
    updateApiData: spy(),
    params: {},
    duration: '1h'
  };

  let component;

  if (enzymeFlag) {
    component = mount(<PageHeader {...props} />);
  }
  else {
    const renderer = createRenderer();
    renderer.render(<PageHeader {...props} />);
    component = renderer.getRenderOutput();
  }

  return {
    props,
    component
  };
}

function setupPageHeaderShallow(auth = {user: null}, showKibana = false) {
  const props = {
    title: 'rank',
    auth,
    showKibana,
    hideKibana: spy(),
    logout: spy(),
    updateApiData: spy(),
    params: {},
    duration: '1h'
  };

  let component = shallow(<PageHeader {...props} />);

  return {
    props,
    component
  };
}

describe('<PageHeader />', () => {
  it('should layout Material UI\'s AppBar', () => {
    const {component} = setupPageHeader();
    expect(component.type).to.equal(AppBar);

    const children = component.props.children;
    expect(children.length).to.equal(3);

    const [dropDown] = children;
    expect(dropDown.type).to.equal(DropDownMenu);
  });

  it('should toggle menu', () => {
    const auth = {user: {id: 'random', name: 'John Snow'}};
    let {component} = setupPageHeader(auth, undefined, true);

    expect(component.props().title).to.equal('rank');
    expect(component.props().showKibana).to.be.false;
    expect(component.props().auth).to.deep.equal(auth);

    let toggleMenu = component.ref('menuToggleDiv');
    expect(toggleMenu.childAt(0).type()).to.equal('div');
    expect(toggleMenu.children().length).to.equal(1);
    expect(component.state().showMenu).to.be.false;

    toggleMenu.simulate('click');

    expect(toggleMenu.childAt(1).type()).to.not.be.null;
    expect(toggleMenu.childAt(1).type()).to.equal(Paper);
    expect(toggleMenu.children().length).to.equal(2);
    expect(component.state().showMenu).to.be.true;
  });

  describe('timeRange dropDown', function() {
    it('should have dropdown with 9 children', () => {
      let {component} = setupPageHeaderShallow(undefined, false),
        dropDown = component.childAt(0);

      expect(dropDown.type()).to.equal(DropDownMenu);
      expect(dropDown.children().length).to.equal(9);
      expect(dropDown.childAt(0).type()).to.equal(MenuItem);
      expect(dropDown.childAt(1).type()).to.equal(MenuItem);
      expect(dropDown.childAt(2).type()).to.equal(MenuItem);
      expect(dropDown.childAt(3).type()).to.equal(MenuItem);
      expect(dropDown.childAt(4).type()).to.equal(MenuItem);
      expect(dropDown.childAt(5).type()).to.equal(MenuItem);
      expect(dropDown.childAt(6).type()).to.equal(MenuItem);
      expect(dropDown.childAt(7).type()).to.equal(MenuItem);
      expect(dropDown.find(MenuItem).length).to.equal(9);
    });

    it('should call time range on click', () => {
      let {component} = setupPageHeaderShallow(undefined, false),
        dropDown = component.childAt(0);
      dropDown.childAt(2).simulate('touchTap');
      // expect(component.state().value).to.equal(2);
    });
  });

  describe('user dropdown', function() {
    it('should call logout', () => {
      const auth = {user: {id: 'random', name: 'John Snow'}};
      let {component} = setupPageHeader(auth, undefined, true);

      let toggleMenu = component.ref('menuToggleDiv');
      expect(toggleMenu.childAt(0).type()).to.equal('div');
      expect(toggleMenu.children().length).to.equal(1);
      expect(component.state().showMenu).to.be.false;

      toggleMenu.simulate('click');

      expect(toggleMenu.childAt(1).type()).to.not.be.null;
      expect(toggleMenu.childAt(1).type()).to.equal(Paper);
      expect(toggleMenu.children().length).to.equal(2);
      expect(component.state().showMenu).to.be.true;

      const button = toggleMenu.find('MenuItem').first().find('EnhancedButton');

      simulateEvent(button, 'click');
      expect(component.prop('logout').callCount).to.equal(1);
    });
  });
});
