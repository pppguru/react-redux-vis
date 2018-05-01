import React, {PropTypes} from 'react';
import moment from 'moment';

import AppBar from 'material-ui/AppBar';
import DropDownMenu from 'material-ui/DropDownMenu';
import Menu from 'material-ui/Menu/Menu';
import MenuItem from 'material-ui/MenuItem/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppTheme from 'theme/AppTheme';

import Image from 'components/widgets/Image';
import TimeRange from 'components/TimeRange';

import {updateApiData} from 'actions/parentCard';
import {logout} from 'actions/auth';

import { connect } from 'react-redux';

import {Colors} from '../../../commons/colors';
import { Link } from 'react-router';

const muiTheme = getMuiTheme(AppTheme);

const TimeRanges = [
  {
    text: '1 Hour',
    param: '1h'
  },
  {
    text: '6 Hours',
    param: '6h'
  },
  {
    text: '12 Hours',
    param: '12h'
  },
  {
    text: '24 Hours',
    param: '24h'
  },
  {
    text: '48 Hours',
    param: '48h'
  },
  {
    text: '1 Week',
    param: '1w'
  },
  {
    text: '1 Month',
    param: '1mo'
  },
  {
    text: '2 Month',
    param: '2mo'
  }
];

const styles = {
  appBar: {
    height: '64px',
    position: 'fixed',
    zIndex: 1101,
    top: 0,
    width: '100%',
    fontWeight: 300
  },
  menuStyle: {
    color: Colors.arctic,
    height: '64px',
    lineHeight: '64px'
  },
  userWrap: {
    height: '64px',
    color: Colors.arctic,
    textAlign: 'right',
    margin: '0 15px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  usericon: {
    fontSize: '32px',
    lineHeight: '32px',
    marginLeft: '10px'
  },
  calendarWrap: {
    position: 'relative'
  },
  calendarIcon: {
    lineHeight: '64px',
    marginRight: '30px',
    cursor: 'pointer',
    color: Colors.white,
    opacity: 0.8
  },
  calendar: {
    position: 'absolute',
    top: '54px',
    right: '20px'
  },
  dropicon: {
    top: 0,
    opacity: 0.54
  },
  logoWrap: {
    display: 'flex',
    height: '100%'
  },
  label: {
    textDecoration: 'none',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  clientLogo: {
    display: 'flex',
    maxHeight: '40px'
  },
  rankLogo: {
    display: 'flex',
    marginRight: '20px'
  }
};

function getTimeRangeItems() {
  return TimeRanges.map((val, index) => {
    return <MenuItem value={index + 1} primaryText={val.text} key={index} />;
  });
}

function getFormatedDate(date) {
  return date.format('MMM D, H:mm');
}

export class PageHeader extends React.Component {
  constructor(props) {
    super(props);
    let value = 1,
      customRange = 'Select Range';

    if (props.duration.window) {
      TimeRanges.forEach((range, index) => {
        if (range.param === props.duration.window) {
          value = index + 1;
        }
      });
    }
    else if (props.duration.start) {
      const {duration: {start, end}} = props,
        s = getFormatedDate(moment(start)),
        e = getFormatedDate(moment(end));
      value = 'custom';
      customRange = `${s} - ${e}`;
    }

    this.state = {
      value,
      customRange,
      showMenu: false,
      showTimeRange: false
    };
  }

  static propTypes = {
    updateApiData: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    duration: PropTypes.object.isRequired
  }

  getChildContext() {
    return {muiTheme: getMuiTheme(muiTheme)};
  }

  handleTimeChange = (event, index, value) => {
    if (value !== 'custom') {
      this.props.updateApiData(TimeRanges[index], this.props.params);
      this.setState({ value });
    }
    else {
      this.toggleTimeRange();
    }
  }

  toggleMenu = () => {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  toggleTimeRange = () => {
    this.setState({
      showTimeRange: !this.state.showTimeRange
    });
  }

  updateDuration = (state) => {
    const {from, to, fromText, toText} = state;
    this.props.updateApiData({ start: from.utc().format(), end: to.utc().format() }, this.props.params);
    this.setState(
      {customRange: `${fromText} - ${toText}`},
      () => {
        // this.handleTimeChange(null, null, 'custom');
        this.setState({ value: 'custom' });
        this.toggleTimeRange();
      });
  }

  render() {
    const {props} = this,
      name = props.auth.user ? props.auth.user.name : '';

    const title = (
      <div style={styles.logoWrap}>
        <Link to='/' style={styles.label}>
          <img src='/rank-logo.png' style={styles.rankLogo} alt='Logo' />
        </Link>
        <div style={styles.label}>
          <Image imageUrl='/client-logo.png'
            alt='Client Logo'
            style={styles.clientLogo} />
        </div>
      </div>
    );

    return (
      <AppBar title={title}
        style={{...styles.appBar, ...props.style}}
        showMenuIconButton={false}>

        <DropDownMenu
          ref='dropDown'
          style={styles.menuStyle}
          labelStyle={{...styles.menuStyle, ...styles.label}}
          iconStyle={{...styles.menuStyle, ...styles.dropicon}}
          value={this.state.value}
          onChange={this.handleTimeChange}
          underlineStyle={{borderTop: 0}}>
          {getTimeRangeItems()}
          <MenuItem value='custom' primaryText={this.state.customRange} />
        </DropDownMenu>

        <div style={styles.calendarWrap}>
          <FontIcon
            style={styles.calendarIcon}
            className='material-icons'
            onClick={this.toggleTimeRange}>
            date_range
          </FontIcon>
          {
            this.state.showTimeRange
              ? <TimeRange
                duration={props.duration}
                style={styles.calendar}
                onChange={this.updateDuration} />
              : null
          }
        </div>

        {
          name
          ? (
            <div onClick={this.toggleMenu} ref='menuToggleDiv'>
              <div style={styles.userWrap}>
                <span style={styles.label}>{name}</span>
                <FontIcon style={styles.usericon} className='material-icons'>
                  account_circle
                </FontIcon>
              </div>

              {
                this.state.showMenu
                ? (
                  <Paper style={styles.menuWrap}
                    rounded={false}>
                    <Menu value={1}
                      onChange={this.handleChange}
                      autoWidth={false}>
                      <MenuItem value={1} primaryText='Log Out' onClick={props.logout} />
                    </Menu>
                  </Paper>
                )
                : null
              }
            </div>
          )
          : null
        }

      </AppBar>
    );
  }
}

PageHeader.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return { auth: state.auth, duration: state.duration };
}

export default connect(mapStateToProps, {
  updateApiData, logout
})(PageHeader);
