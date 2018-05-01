import React from 'react';
import { mount } from 'enzyme';
import {spy} from 'sinon';

import Sidebar from 'layouts/CoreLayout/Sidebar';

const links = [
  {
    to: '/alerts',
    icon: 'warning',
    text: 'alerts'
  },
  {
    to: '/country',
    icon: 'public',
    text: 'country'
  },
  {
    to: '/traffic',
    icon: 'swap_vert',
    text: 'traffic'
  },
  {
    to: '/assets',
    icon: 'desktop_mac',
    text: 'asset'
  },
  {
    to: '/user-agent',
    icon: 'dvr',
    text: 'user-agent'
  }
];

const submenuLinks = [
  {
    to: '/user-agent',
    icon: 'dvr',
    text: 'user-agent'
  },
  {
    to: '/dvr',
    icon: 'dvr',
    text: 'submenu',
    submenu: [
      {
        to: '/subment1',
        icon: 'desktop_mac',
        text: 'asset'
      },
      {
        to: '/subment2',
        icon: 'dvr',
        text: 'user-agent'
      }
    ]
  }
];

function getSidebar(propObj = {}) {
  const props = Object.assign({}, {
    location: {pathname: '/'},
    sidebar: links,
    showSearch: false,
    toggleSearch: spy()
  }, propObj);

  const component = mount(<Sidebar {...props} />);
  return { component };
}

describe('<Sidebar />', () => {
  let component;

  beforeEach(function() {
    ({component} = getSidebar());
  });

  it('should exist', () => {
    expect(Sidebar).to.exist;
  });

  it('should have type of Sidebar', () => {
    expect(component.type()).to.equal(Sidebar);
  });

  it('should have one search element', () => {
    expect(component.find('.search-link')).to.exist;
  });

  it('should not show search by default', () => {
    expect(component.find('.search')).to.have.length(0);
  });

  it('should call toggleSearch on click of search link', () => {
    expect(component.find('.search')).to.have.length(0);
    const searchLink = component.find('.search-link');
    searchLink.simulate('click');
    expect(component.props().toggleSearch.callCount).to.equal(1);
  });

  // it('should show search if showSearch is true', function() {
  //   const comp = getSidebar({ showSearch: true }).component;
  //   expect(comp.find('.search')).to.have.length(1);
  // });

  it('should have 5 links', () => {
    expect(component.find('Link').length).to.equal(5);
  });

  it('should have correct text', () => {
    component.find('Link').forEach((node, index) => {
      expect(node.text()).to.have.string(links[index].text);
    });
  });

  it('should have apt urls', () => {
    component.find('Link').forEach((node, index) => {
      expect(node.prop('to')).to.exist;
      expect(node.prop('to')).to.equal(links[index].to);
    });
  });

  context('Multilevel Navigation', () => {
    let component;

    beforeEach(function() {
      ({ component } = getSidebar({sidebar: submenuLinks}));
    });

    it('should have 4 links', () => {
      expect(component.find('Link').length).to.equal(4);
    });

    it('should have 1 submenu', () => {
      expect(component.find('.submenu')).to.have.length(1);
    });

    it('should have 2 Links in the submenu', () => {
      const submenu = component.find('.submenu');
      expect(submenu.find('Link')).to.have.length(2);
    });

    it('should have corrent link names for the submenu', () => {
      const links = component.find('.submenu').find('Link'),
        submenu = submenuLinks[1].submenu;

      links.forEach((node, index) => {
        expect(node.text()).to.have.string(submenu[index].text);
        expect(node.prop('to')).to.equal(submenu[index].to);
      });
    });
  });
});
