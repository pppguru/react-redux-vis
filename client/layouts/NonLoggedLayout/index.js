import React from 'react';
import Login from './login';

import {Colors} from '../../../commons/colors';

const styles = {
  wrap: {
    height: '100%',
    paddingTop: '50px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: Colors.pebble
  }
};

class NonLoggedLayout extends React.Component {
  render() {
    return (
      <div style={styles.wrap}>
        <Login />
      </div>
    );
  }
}

export default NonLoggedLayout;
