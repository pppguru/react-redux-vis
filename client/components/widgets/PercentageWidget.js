import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import {Colors} from '../../../commons/colors';

function setOverlayDivBackground(style, color) {
  style.overlayDiv = Object.assign(style.overlayDiv,
    {
      backgroundColor: color
    }
  );
}

function setOverlayDivBorder(style, borderSide, borderWidth, color) {
  let border = {};
  border['border' + borderSide] = borderWidth + ' solid ' + color;
  style.overlayDiv = Object.assign(style.overlayDiv, border);
}

function setIconColor(style, color) {
  style.icon = Object.assign(style.icon,
    {
      color: color
    }
  );
}

function getIcon(percentage, iconIndex, iconName) {
  const style = {
    overlayDiv: {
      height: '14px',
      width: '23px',
      position: 'absolute',
      zIndex: 1,
      backgroundColor: Colors.cloud,
      marginTop: '2px',
      marginLeft: '1px',
      borderTopLeftRadius: '3px',
      borderTopRightRadius: '3px',
      borderLeft: '2px solid ' + Colors.bar,
      borderTop: '2px solid ' + Colors.bar,
      borderRight: '2px solid ' + Colors.bar
    },
    'icon': {
      color: Colors.bar
    }
  };

  let percentageValue = parseInt(percentage);

  if (isNaN(percentageValue)) {
    percentageValue = 0;
  }
  iconIndex = parseInt(iconIndex);

  if (percentageValue >= 100) {
    setOverlayDivBackground(style, Colors.bar);
  }

  if (percentageValue === 0) {
    setOverlayDivBackground(style, Colors.cloud);
    setOverlayDivBorder(style, 'Top', '2px', Colors.cloud);
    setOverlayDivBorder(style, 'Left', '2px', Colors.cloud);
    setOverlayDivBorder(style, 'Right', '2px', Colors.cloud);
    setIconColor(style, Colors.cloud);
  }
  else {
    if (percentage.length === 1) {
      if (iconIndex > 1) {
        setOverlayDivBackground(style, Colors.cloud);
        setOverlayDivBorder(style, 'Top', '2px', Colors.cloud);
        setOverlayDivBorder(style, 'Left', '2px', Colors.cloud);
        setOverlayDivBorder(style, 'Right', '2px', Colors.cloud);
        setIconColor(style, Colors.cloud);
      }
      if (iconIndex === 1) {
        setOverlayDivBorder(style, 'Top', '2px', Colors.cloud);
        setOverlayDivBorder(style, 'Left', '2px', Colors.cloud);
        setOverlayDivBorder(style, 'Right', '2px', Colors.cloud);
        setOverlayDivBorder(style, 'Bottom', (percentageValue + 1) + 'px', Colors.bar);
        setIconColor(style, Colors.bar);
      }
    }
  }

  if (percentage.length === 2) {
    let firstDigit = parseInt(percentage.charAt(0)),
      secondDigit = parseInt(percentage.charAt(1));

    if (iconIndex <= firstDigit) {
      setOverlayDivBackground(style, Colors.bar);
    }

    if (iconIndex > firstDigit) {
      setOverlayDivBackground(style, Colors.cloud);
      setOverlayDivBorder(style, 'Top', '2px', Colors.cloud);
      setOverlayDivBorder(style, 'Left', '2px', Colors.cloud);
      setOverlayDivBorder(style, 'Right', '2px', Colors.cloud);
      setIconColor(style, Colors.cloud);
    }

    if ((percentageValue % 10) !== 0 && iconIndex === (firstDigit + 1)) {
      setOverlayDivBorder(style, 'Bottom', (secondDigit + 1) + 'px', Colors.bar);
      setIconColor(style, Colors.bar);
    }
  }

  return (
    <div key={iconIndex} style={{marginBottom: '1px'}}>
      <div style={style.overlayDiv}></div>
      <FontIcon className='material-icons'
        style={style.icon}>
        {iconName}
      </FontIcon>
    </div>
  );
}

class PercentageWidget extends React.Component {
  loadIcons() {
    const {props} = this;
    if (!props || !props.percentage) {
      return;
    }

    let icons = [];
    for (let i = 10; i > 0; i--) {
      icons.push(getIcon(props.percentage, i, props.iconName));
    }
    return icons;
  }

  render() {
    return (
      <div>
        {this.loadIcons()}
      </div>
    );
  }
}

export default PercentageWidget;
