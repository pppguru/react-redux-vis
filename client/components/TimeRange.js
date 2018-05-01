import React, { PropTypes } from 'react';
import CalendarRange from 'components/CalendarRange';
import moment from 'moment';

import { Colors } from '../../commons/colors';
import 'styles/components/_timeRange.scss';

const styles = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    background: Colors.white,
    boxShadow: `0 0px 2px ${Colors.shadow}`
  },
  doneWrap: {
    border: 0,
    padding: 0,
    boxShadow: 'none',
    height: '35px',
    lineHeight: '35px',
    fontWeight: 'bold',
    fontSize: '13px',
    width: '150px',
    color: Colors.white,
    backgroundColor: Colors.bar,
    textAlign: 'center',
    textTransform: 'uppercase',
    cursor: 'pointer',
    margin: '9px 9px 9px auto'
  },
  fromCalendar: {
    marginRight: '2px'
  },
  calendarWrap: {
    display: 'flex'
  }
};

function getFormatedDate(date) {
  return date.format('MMM D, HH:mm:ss');
}

class TimeRange extends React.Component {
  getInitFromDate(to) {
    const { window } = this.props.duration;
    if (window) {
      const lastUnit = window.slice(-1),
        lastTwoUnit = window.slice(-2);

      if (lastUnit === 'h') { // if duration is in hour
        return to.clone().subtract(window.slice(0, -1), 'hours');
      }
      else if (lastUnit === 'w') { // if duration is in week
        return to.clone().subtract(window.slice(0, -1), 'weeks');
      }
      else if (lastTwoUnit === 'mo') { // if duration is in month
        return to.clone().subtract(window.slice(0, -2), 'months');
      }
    }
    else {
      return to.clone().subtract(1, 'days');
    }
  }

  constructor(props) {
    super(props);
    const {start, end} = props.duration;

    const to = moment(end),
      from = start ? moment(start) : this.getInitFromDate(to),
      fromText = getFormatedDate(from),
      toText = getFormatedDate(to);

    this.state = {
      from,
      to,
      fromText,
      toText,
      activeTab: 'from'
    };
  }

  static propTypes = {
    onChange: PropTypes.func,
    duration: PropTypes.object.isRequired
  }

  handleFromChange = (m) => {
    this.setState({
      from: m,
      fromText: getFormatedDate(m)
    });
  }

  handleToChange = (m) => {
    const {from} = this.state,
      newObj = {
        to: m,
        toText: getFormatedDate(m)
      };

    if (m.diff(from, 'seconds') <= 0) {
      newObj.from = m.clone().subtract(1, 'days');
    }

    this.setState(newObj);
  }

  done = (m) => {
    const { state } = this;
    this.props.onChange(state);
  }

  setActiveTab = (activeTab) => {
    return () => {
      this.setState({activeTab});
    };
  }

  render() {
    const { props } = this,
      style = {...styles.wrap, ...props.style};

    return (
      <div style={style}>
        <div style={styles.calendarWrap}>
          <CalendarRange
            style={styles.fromCalendar}
            moment={this.state.from}
            onChange={this.handleFromChange}
            max={this.state.to}
            title='from' />
          <CalendarRange
            moment={this.state.to}
            onChange={this.handleToChange}
            title='to' />
        </div>

        <button style={styles.doneWrap}
          className='time-range'
          onClick={this.done}
          tabIndex='0'>
          Done
        </button>
      </div>
    );
  }
}

export default TimeRange;
