import React from 'react';
import {Colors} from '../../../commons/colors';
import {getColor} from '../../../commons/utils/colorUtils';
import { DEFAULT_FONT } from 'Constants';

const styles = {
  wrap: {
    display: 'flex'
  },
  score: {
    color: Colors.white,
    borderRadius: '50%',
    width: '56px',
    height: '56px',
    lineHeight: '50px',
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: DEFAULT_FONT,
    border: '3px solid',
    boxShadow: '0 0 2px rgba(0, 0, 0, 0.3)'
  },
  arrowIcon: {
    marginLeft: '12px',
    transform: 'rotate(-90deg)'
  },
  inverse: {
    borderRadius: 0,
    width: '50px',
    height: '50px',
    lineHeight: '50px',
    textAlign: 'center',
    fontSize: '24px',
    fontFamily: DEFAULT_FONT
  }
};

class ScoreWidget extends React.Component {
  render() {
    const {props} = this,
      scoreValue = parseInt(props.scoreValue),
      color = getColor(scoreValue);

    let style;
    if (props.inverse) {
      style = {...styles.inverse, color};
    }
    else {
      style = {...styles.score, backgroundColor: color};
    }

    return (
      <div style={styles.wrap}>
        <div style={{...style, ...props.style}}>
          {scoreValue}
        </div>
        {
          props.inverse || props.hideArrow
          ? null
          : (
            <i style={styles.arrowIcon} className='material-icons'>
            arrow_drop_down
            </i>
          )
        }

      </div>
    );
  }
}

export default ScoreWidget;
