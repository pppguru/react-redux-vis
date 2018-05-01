import React from 'react';
import FontIcon from 'material-ui/FontIcon';

export function getArrowIcon(change, style) {
  if (change !== 'N/A') {
    if (change === 0) {
      return null;
    }
    else if (change > 0) {
      return <FontIcon style={style} className='material-icons'>trending_up</FontIcon>;
    }
    else if (change < 0) {
      return <FontIcon style={style} className='material-icons'>trending_down</FontIcon>;
    }
  }
  return null;
}
