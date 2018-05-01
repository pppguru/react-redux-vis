import React from 'react';

import { mount, shallow, render } from 'enzyme';
import {spy} from 'sinon';

import Card from 'material-ui/Card/Card';
import TimelineCard from 'components/TimelineCard';
import MultiSeriesCombiChart from 'components/charts/MultiSeriesCombiChart';
import {wrapThemeProvider} from '../../testUtils';

let props = {
  id: 'timelineCard',
  Type: 'SSH',
  data: {
    'id': 'EaeBc8MnEeaQdgpKIkG2eQ',
    'Date': '2016-12-16T00:31:51.372',
    'display': {
      'sourceDest': {
        'source': {
          'ip': '121.18.238.114',
          'country': 'cn',
          'port': 56265
        },
        'dest': {
          'ip': '172.31.7.62',
          'port': 22
        }
      },
      'Type': {
        'displayKey': true,
        'value': 'SSH'
      },
      'Direction': {
        'displayKey': true,
        'value': ''
      },
      'Client': {
        'displayKey': true,
        'value': 'SSH-2.0-PUTTY'
      },
      'Server': {
        'displayKey': true,
        'value': 'SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.8'
      },
      'Successful': {
        'displayKey': true,
        'value': 'Failed'
      }
    }
  },
  card: 'TIMELINE_CARD',
  attributes: {
    'type': 'traffic',
    'displaySelectedRows': true,
    'noOfEventsPerPage': 10,
    'maxNumbersOnLeftRightPagination': 4,
    'style': {
      'width': '100%',
      'backgroundColor': '#F7F7F9'
    },
    'otherStyles': {
      'flex': {
        'display': 'flex'
      },
      'pagination': {
        'bottom': 0,
        'position': 'absolute'
      }
    },
    'id': 'timeline-component'
  },
  updateRoute: spy(),
  getContextualMenuApiObj: spy()
};

function renderTimelineCard() {
  let component = shallow(wrapThemeProvider(<TimelineCard {...props} />));
  return component.find('TimelineCard');
}

function mountTimelineCard() {
  return mount(wrapThemeProvider(<TimelineCard {...props} />));
}

function mountTimelineCardComponent() {
  let component = mount(<TimelineCard {...props} />);
  return component.find('TimelineCard');
}

describe('<TimelineCard />', () => {
  it('exists', () => {
    expect(TimelineCard).to.exist;
  });

  it('should have correct props', () => {
    const component = renderTimelineCard();
    expect(component.props().id).to.be.defined;
    expect(component.props().id).to.equal('timelineCard');
    expect(component.type()).to.equal(TimelineCard);
    expect(component.props().data).to.be.defined;
    expect(component.props().selectedCardId).to.be.defined;
    expect(component.props().updateRoute).to.exist;
    expect(component.props().updateRoute).to.be.a('function');
    expect(component.props().getContextualMenuApiObj).to.exist;
    expect(component.props().getContextualMenuApiObj).to.be.a('function');
  });

  it('renders the timeline card', () => {
    const wrapper = mountTimelineCard();
    expect(wrapper.find(Card)).to.exist;
  });

  it('display anomaly chart', () => {
    props.chart = {
      'chartOptions': {
        'xAxisName': 'Time',
        'divLineThickness': '2',
        'lineThickness': '1',
        'showYAxisValues': '1',
        'xAxisNameFontSize': '10',
        'yAxisNameFontSize': '10',
        'labelFontSize': '8',
        'drawAnchors': '1',
        'anchorRadius': '1',
        'showlegend': '0',
        'outCnvBaseFontSize': '8',
        'divlineThickness': 1,
        'canvasBgColor': 'transparent',
        'bgColor': 'transparent'
      }
    };
    const component = renderTimelineCard();
    expect(component.props().chart).to.be.defined;
    expect(MultiSeriesCombiChart).to.exist;
  });

  it('display alert border', () => {
    props.data = {
      'id': 'OikKAsdw',
      'Type': 'Rank Alert',
      'Date': '2016-12-16T00:32:54.468',
      'display': {
        'sourceDest': {
          'source': {
            'ip': '121.18.238.114'
          },
          'dest': {
            'ip': '172.31.7.62'
          }
        },
        'Description': {
          'displayKey': true,
          'value': 'SSH Brute Force Attack Attempt'
        },
        'Message': {
          'displayKey': true,
          'value': '121.18.238.114 attempted to connect to 172.31.7.62 102 times'
        },
        'Category': {
          'displayKey': true,
          'value': 'suspicious-login'
        },
        'Score': {
          'displayKey': true,
          'value': '75'
        }
      }
    };
    const wrapper = mountTimelineCard();
    expect(wrapper.find(Card)).to.have.style('borderLeft', '5px solid rgb(231, 43, 68)');
  });

  it('simulates card click events', () => {
    const loadSecondaryTimeline = sinon.spy();
    const wrapper = mount(wrapThemeProvider(
      <TimelineCard {...props}>
        <Card onClick={loadSecondaryTimeline()} />
      </TimelineCard>
    ));
    wrapper.find(Card).simulate('click');
    expect(loadSecondaryTimeline.calledOnce).to.equal(true);
    expect(loadSecondaryTimeline.callCount).to.equal(1);
  });
});
