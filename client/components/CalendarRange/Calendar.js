import React, { PropTypes } from 'react';
import cx from 'classnames';
import blacklist from 'blacklist';
import range from 'lodash/range';
import chunk from 'lodash/chunk';
import moment from 'moment';

const now = moment();

const Day = function(props) {
  const i = props.i,
    w = props.w,
    m = props.m,
    selected = props.selected,
    prevMonth = (w === 0 && i > 7),
    nextMonth = (w >= 4 && i <= 14),
    tdProps = blacklist(props, 'i', 'w', 'd', 'className', 'm', 'current'),
    currentDay = i === selected.date() && m.month() === selected.month() && m.year() === selected.year(),
    today = m.year() === now.year() && m.month() === now.month() && i === now.date();

  tdProps.className = cx({
    'prev-month': prevMonth,
    'next-month': nextMonth,
    'current-day': currentDay,
    'm-calendar-date': !prevMonth && !nextMonth,
    today
  });

  if (prevMonth || nextMonth) {
    return <td />;
  }
  else {
    return <td {...tdProps}>{i}</td>;
  }
};

export default class Calendar extends React.Component {
  static propTypes = {
    moment: PropTypes.object.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    max: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      calendar: props.moment.clone()
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({calendar: nextProps.moment.clone()});
  }

  render() {
    const m = this.state.calendar,
      d = m.date(),
      d1 = m.clone().subtract(1, 'month').endOf('month').date(),
      d2 = m.clone().date(1).day(),
      d3 = m.clone().endOf('month').date();

    const days = [].concat(
      range(d1 - d2 + 1, d1 + 1),
      range(1, d3 + 1),
      range(1, 33 - d3 - d2 + 1)
    );

    const weeks = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
      <div className={cx('m-calendar', this.props.className)}>
        <div className='toolbar'>
          <i className='material-icons' onClick={this.prevMonth}>arrow_drop_down</i>
          <span className='current-date'>{m.format('MMMM YYYY')}</span>
          <i className='material-icons' onClick={this.nextMonth}>arrow_drop_up</i>
        </div>

        <table>
          <thead>
            <tr>
              {weeks.map((w, i) => <td key={i}>{w}</td>)}
            </tr>
          </thead>

          <tbody>
            {chunk(days, 7).map((row, w) => (
              <tr key={w}>
                {row.map((i) => (
                  <Day key={i} i={i} d={d} w={w} m={m} selected={this.props.moment}
                    onClick={this.selectDate.bind(null, i, w)}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  isWithInRange(updatedDate) {
    const { max } = this.props;

    if (max) {
      const diff = max.diff(updatedDate, 'hours');
      if (diff < 0) return false; // if selected date is greater then max allowed then return
    }

    return true;
  }

  selectDate = (i, w) => {
    const { moment: m, onChange } = this.props,
      {calendar} = this.state;

    const updatedDate = m.clone().date(i).month(calendar.month()).year(calendar.year());
    if (this.isWithInRange(updatedDate)) {
      onChange(updatedDate);
    }
  }

  prevMonth = () => {
    const calendar = this.state.calendar;
    calendar.subtract(1, 'month');
    this.setState({calendar});
  }

  nextMonth = () => {
    const calendar = this.state.calendar;
    calendar.add(1, 'month');
    this.setState({ calendar });
  }
};
