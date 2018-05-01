import React from 'react';
import { shallow } from 'enzyme';

import {wrapThemeProvider} from '../../../testUtils';
import {Search} from 'layouts/CoreLayout/Search';

import {spy} from 'sinon';

describe('<Search />', () => {
  let component, props;

  beforeEach(function() {
    props = {
      auth: {},
      toggleSearch: spy()
    };

    component = shallow(wrapThemeProvider(<Search {...props} />));
    component = component.find('Search');
  });

  it('should exist', () => {
    expect(Search).to.exist;
  });

  it('should have type of Sidebar', () => {
    expect(component.type()).to.equal(Search);
  });
});
