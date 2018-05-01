import React from 'react';

import { mount, shallow } from 'enzyme';
import {spy} from 'sinon';

import SearchBar from 'components/SearchBar';
import {wrapThemeProvider} from '../../testUtils';

function shallowRenderSearchBar(propsOptions) {
  let props = {
    floatingSearchBar: true,
    loadFloatingSearchBar: spy(),
    updateSearch: spy(),
    searchText: ''
  };

  props = Object.assign({}, props, propsOptions);

  let component = shallow(wrapThemeProvider(<SearchBar {...props} />));
  return component.find('SearchBar');
}

function mountSearchBar(propsOptions) {
  let props = {
    floatingSearchBar: true,
    loadFloatingSearchBar: spy(),
    updateSearch: spy(),
    searchText: ''
  };

  props = Object.assign({}, props, propsOptions);

  let component = mount(<SearchBar {...props} />);
  return component;
}

describe('<SearchBar />', () => {
  it('exists', () => {
    expect(SearchBar).to.exist;
  });

  it('has correct props', () => {
    const component = shallowRenderSearchBar({floatingSearchBar: true, searchText: 'malware'});

    expect(component.props().floatingSearchBar).to.equal(true);
    expect(component.props().loadFloatingSearchBar).to.exist;
    expect(component.props().loadFloatingSearchBar).to.be.a('function');
    expect(component.props().updateSearch).to.exist;
    expect(component.props().updateSearch).to.be.a('function');
    expect(component.props().searchText).to.equal('malware');
  });

  it('should have required instances', () => {
    const component = mountSearchBar();
    expect(component.instance().styles).to.be.defined;
    expect(component.instance().clearSearchText).to.be.defined;
    expect(component.instance().hideClearIcon).to.be.defined;
    expect(component.instance().showClearIcon).to.be.defined;
    expect(component.instance().focusSearchText).to.be.defined;
  });

  // it('should display clear icon if search bar is floating', () => {
  //   const component = mountSearchBar({floatingSearchBar: true});
  //   expect(component.state().showClearIcon).to.be.defined;
  //   expect(component.state().showClearIcon).to.equal(true);
  //   // expect(component.instance().styles.clearIcon).to.equal(Object{color: '#ffffff', background: '#444c63'});
  // });

  // it('should not display clear icon if search bar is non-floating', () => {
  //   const component = mountSearchBar({floatingSearchBar: false});
  //   expect(component.state().showClearIcon).to.be.defined;
  //   expect(component.state().showClearIcon).to.equal(false);
  //   // expect(component.instance().styles.clearIcon).to.equal(Object{color: 'transparent', background: 'transparent'});
  // });

  // it('should show clear icon on input box focus', () => {
  //   const component1 = mountSearchBar({floatingSearchBar: false});
  //   component1.instance().showClearIcon();
  //   expect(component1.state().showClearIcon).to.equal(true);

  //   const component2 = mountSearchBar({floatingSearchBar: false});
  //   component2.instance().focusSearchText();
  //   expect(component2.state().showClearIcon).to.equal(false);
  // });

  // it('should hide clear icon on input box blur', () => {
  //   const component1 = mountSearchBar({floatingSearchBar: false});
  //   component1.instance().hideClearIcon();
  //   expect(component1.state().showClearIcon).to.equal(false);
  // });

  // it('should hide floating search bar on click of clear icon', () => {
  //   const component1 = mountSearchBar({floatingSearchBar: true});
  //   component1.instance().clearSearchText();
  //   expect(component1.props().floatingSearchBar).to.equal(true);
  // });
});
