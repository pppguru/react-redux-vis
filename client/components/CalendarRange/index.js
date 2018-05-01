import React, { PropTypes } from 'react';
import Calendar from './Calendar';
import { Colors, BarColorShade8 } from '../../../commons/colors';
import { validateDate, validateTime } from '../../../commons/utils/dateUtils';
import { isNumber } from 'utils/utils';
import './scss/calendarRange.scss';

const styles = {
  wrap: {
    width: '253px'
  },
  header: {
    backgroundColor: Colors.bar,
    color: Colors.white,
    padding: '16px',
    fontWeight: 'normal'
  },
  title: {
    color: Colors.white,
    textTransform: 'capitalize',
    fontWeight: '500',
    fontSize: '10px',
    marginBottom: '5px'
  },
  timeDateWrap: {
    display: 'flex',
    fontSize: '12px',
    fontWeight: '500',
    color: Colors.text
  },
  inputWrap: {
    display: 'flex'
  },
  label: {
    textTransform: 'uppercase'
  },
  input: {
    backgroundColor: BarColorShade8,
    border: 0,
    outline: 'none',
    width: '20px',
    letterSpacing: '0.5px',
    marginLeft: '2px',
    padding: '2px',
    textAlign: 'center'
  },
  timeWrap: {
    marginLeft: 'auto',
    textAlign: 'right'
  },
  timeInput: {
    width: '58px',
    textAlign: 'right'
  },
  dateInputWrap: {
    display: 'flex',
    flexDirection: 'column'
  },
  formatTextWrap: {
    marginTop: '3px'
  },
  formatText: {
    marginLeft: '2px',
    padding: '2px',
    width: '20px',
    opacity: '0.35'
  },
  invalid: {
    color: '#e72b44'
  },
  year: {
    width: '35px'
  }
};

function getTimeText(moment) {
  return moment.format('HH:mm:ss');
}

function getDateText(moment) {
  return moment.format('DD-MM-YYYY');
}

// const monthWith31days =
function isValid(type, value, max) {
  switch (type) {
    case 'hours': {
      if (value >= 0 && value <= 23) return true;
      break;
    }
    case 'minutes': {
      if (value >= 0 && value <= 59) return true;
      break;
    }
    case 'seconds': {
      if (value >= 0 && value <= 59) return true;
      break;
    }
    case 'date': {
      if (value >= 1 && value <= 31) return true;
      break;
    }
    case 'month': {
      if (value >= 0 && value <= 11) return true;
      break;
    }
    case 'year': {
      if (value <= max.year()) return true;
      break;
    }
    default: {
      return false;
    }
  }

  return false;
}

export default class CalendarRange extends React.Component {
  init(moment) {
    this.state = {
      dateText: getDateText(moment),
      timeText: getTimeText(moment),
      isDateValid: true,
      isTimeValid: true,
      date: moment.format('DD'),
      month: moment.format('MM'),
      year: moment.format('YYYY'),
      hours: moment.format('HH'),
      minutes: moment.format('mm'),
      seconds: moment.format('ss')
    };
  }

  constructor(props) {
    super(props);
    const {moment} = props;
    this.init(moment);
  }

  static propTypes = {
    moment: PropTypes.object.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func,
    max: PropTypes.object
  }

  isDateWithInRange(updatedDate) {
    const { max } = this.props;

    if (max) {
      const diff = max.diff(updatedDate, 'hours');
      if (diff < 0) return false; // if selected date is greater then max allowed then return
    }

    return true;
  }

  handleChange = (type) => {
    const {max, moment} = this.props;
    return (event) => {
      let value = event.target.value,
        isValidNumber = isNumber(value);

      if (isValidNumber || value.trim() === '') {
        this.setState(
          { [type]: value },
          () => {
            if (isValid(type, value, max)) {
              const updatedDate = moment.clone()[type](value);
              if (this.isDateWithInRange(updatedDate)) {
                this.props.onChange(updatedDate);
              }
            }
          }
        );
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps.moment);
  }

  render() {
    const {props, state, state: {isDateValid}} = this,
      title = props.title;

    const dateStyle = isDateValid ? styles.input : {...styles.input, ...styles.invalid};

    const moment = props.moment,
      {date, month, year, hours, minutes, seconds} = state;

    return (
      <div style={{...styles.wrap, ...props.style}}>
        <header style={styles.header}>
          <div style={styles.title}>{title}</div>
          <div style={styles.timeDateWrap}>
            <div style={styles.inputWrap}>
              <label style={styles.label}>Date</label>
              <div style={styles.dateInputWrap}>
                <div>
                  <input style={dateStyle}
                    type='text'
                    value={date}
                    tabIndex='0'
                    onChange={this.handleChange('date')} />
                  <input style={dateStyle}
                    type='text'
                    value={month}
                    tabIndex='0'
                    onChange={this.handleChange('month')} />
                  <input style={{...dateStyle, ...styles.year}}
                    type='text'
                    value={year}
                    tabIndex='0'
                    onChange={this.handleChange('year')} />
                </div>

                <div style={styles.formatTextWrap}>
                  <span style={styles.formatText}>dd</span>
                  <span style={styles.formatText}>mm</span>
                  <span style={styles.formatText}>yyyy</span>
                </div>
              </div>

            </div>

            <div style={{...styles.inputWrap, ...styles.timeWrap}}>
              <label style={styles.label}>Time</label>
              <div style={styles.dateInputWrap}>
                <div>
                  <input style={{ ...styles.input }}
                    type='text'
                    value={hours}
                    tabIndex='0'
                    onChange={this.handleChange('hours')} />
                  <input style={{ ...styles.input }}
                    type='text'
                    value={minutes}
                    tabIndex='0'
                    onChange={this.handleChange('minutes')} />
                  <input style={{ ...styles.input }}
                    type='text'
                    value={seconds}
                    tabIndex='0'
                    onChange={this.handleChange('seconds')} />
                </div>
                <div style={styles.formatTextWrap}>
                  <span style={styles.formatText}>hh</span>
                  <span style={styles.formatText}>mm</span>
                  <span style={styles.formatText}>ss</span>
                </div>
              </div>
            </div>
          </div>
        </header>
        <Calendar
          moment={moment}
          onChange={this.props.onChange}
          max={props.max}
        />
      </div>
    );
  }
}
