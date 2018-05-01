import React from 'react';

import {
  createRenderer
} from 'react-addons-test-utils';

import {spy} from 'sinon';

import {CoreLayout} from 'layouts/CoreLayout';
import PageHeaderWrapped from 'layouts/CoreLayout/PageHeader';
import {PageContent} from 'layouts/CoreLayout/PageContent';
import Sidebar from 'layouts/CoreLayout/Sidebar';
import Loader from 'components/Loader';
import ParentCard from 'containers/ParentCard';
import MetricsCard from 'components/MetricsCard';

function getLayout() {
  const layout = [
    [
      {
        'id': '1',
        'type': 'MetricsCard',
        'meta': {
          'showHeader': false,
          'api': null
        },
        'attributes': {
          'title': 'High Priority Anomalies'
        }
      },
      {
        'id': '2',
        'type': 'MetricsCard',
        'meta': {
          'showHeader': false,
          'api': null
        },
        'attributes': {
          'title': 'High Priority Malwares'
        }
      }
    ]
  ];

  return layout;
}

function setup(isLoading = false) {
  let props = {
    fetchUserData: spy(),
    fetchActionsList: spy(),
    logout: spy(),
    history: {},
    auth: { isLoading },
    location: {}
  };

  let renderer = createRenderer();
  renderer.render(<CoreLayout {...props} />);
  let component = renderer.getRenderOutput();

  return {
    props,
    component,
    renderer
  };
}

function setupPageContent(isFetching = false, layout = []) {
  let component,
    props = {
      isFetching,
      layout
    };

  let renderer = createRenderer();
  renderer.render(<PageContent {...props} />);
  component = renderer.getRenderOutput();
  return {
    props,
    component,
    renderer
  };
}

// TODO, part of the tests use shallow render or react addons and others use
// enzyme library. Use enzyme library everywhere.
describe('CoreLayout', () => {
  describe('index File', () => {
    it('should render correctly', () => {
      const { component } = setup();
      let [ header, sidebar, contentWrap ] = component.props.children;

      expect(sidebar.type).to.equal(Sidebar);
      expect(header.type).to.equal(PageHeaderWrapped);
      expect(contentWrap.type).to.equal('div');
    });

    it('should show loader if isLoading flag is true', () => {
      const { component } = setup(true);

      const content = component.props.children[2],
        loader = content.props.children[0];

      expect(loader.type).to.equal(Loader);
    });
  });

  describe('PageContent file', () => {
    it('should show loader if isFetching flag is true', () => {
      const {component} = setupPageContent(true),
        loader = component.props.children;

      expect(loader.type).to.equal(Loader);
    });

    it('should layout components based on layout json passed to it.', () => {
      const layout = getLayout();
      const {component, props} = setupPageContent(false, layout);

      expect(props.layout).to.deep.equal(layout);

      const sections = component.props.children,
        section = sections[0];

      expect(sections.length).to.equal(1);
      expect(section.type).to.equal('section');

      const sectionChildren = section.props.children;
      expect(sectionChildren.length).to.equal(2);

      expect(sectionChildren[0].type).to.equal(ParentCard);
      expect(sectionChildren[1].type).to.equal(ParentCard);

      const firstMetricCard = sectionChildren[0].props.children,
        secondMetricCard = sectionChildren[1].props.children;

      expect(firstMetricCard.type).to.equal(MetricsCard);
      expect(secondMetricCard.type).to.equal(MetricsCard);
    });
  });
});
