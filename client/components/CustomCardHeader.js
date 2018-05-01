import React, {PropTypes} from 'react';

import {Colors} from '../../commons/colors';
import CardHeader from 'material-ui/Card/CardHeader';

const styles = {
  title: {
    color: Colors.navigation,
    fontSize: '20px',
    fontWeight: 300
  },
  header: {
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1101,
    top: 0,
    width: '100%'
  }
};

class CustomCardHeader extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    titleStyle: PropTypes.object
  }

  render() {
    const {props} = this;
    return (
      <CardHeader {...props}
        style={{...styles.header, ...props.style}}
        titleStyle={{...styles.title, ...props.titleStyle}} />
    );
  }
}

export default CustomCardHeader;
