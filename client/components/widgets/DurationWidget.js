import React, {PropTypes} from 'react';
import {msToTime} from '../../../commons/utils/utils';
import {Colors} from '../../../commons/colors';

export class DurationWidget extends React.Component {
  static propTypes = {
    timeValue: PropTypes.number
  }

  convertTime() {
    const {props} = this;
    let timeValue = {};
    timeValue = msToTime(props.timeValue);
    return timeValue;
  }

  render() {
    let timeValue = this.convertTime(),
      style = {
        'hour': {
          backgroundColor: Colors.durationWidget.hour
        },
        'min': {
          backgroundColor: Colors.durationWidget.min
        },
        'sec': {
          backgroundColor: Colors.durationWidget.sec
        }
      };
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div>
          <div className='duration' style={style.hour}>{timeValue.timeArray[0]}</div><br />
          <div className='durationLabel'>hh</div>
        </div>
        <div className='durationSeparator'>:</div>
        <div>
          <div className='duration' style={style.min}>{timeValue.timeArray[1]}</div><br />
          <div className='durationLabel' style={{paddingLeft: '3px'}}>mm</div>
        </div>
        <div className='durationSeparator'>:</div>
        <div>
          <div className='duration' style={style.sec}>{timeValue.timeArray[2]}</div><br />
          <div className='durationLabel' style={{paddingLeft: '10px'}}>ss</div>
        </div>
      </div>
    );
  }
}

export default DurationWidget;
