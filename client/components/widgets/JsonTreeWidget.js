import React from 'react';
import JsonTree from 'react-json-tree';
import {Colors} from '../../../commons/colors';

const styles = {
  arrow: {
    float: 'none',
    marginTop: '6px',
    borderTop: '7px solid ' + Colors.grape
  },
  list: {
    backgroundColor: 'transparent'
  },
  label: {
    fontSize: '13px',
    fontWeight: 'bold',
    color: Colors.grape
  },
  value: {
    fontSize: '13px',
    color: Colors.grape
  }
};

export class JsonWidget extends React.Component {
  render() {
    const {props} = this;
    return (
      <JsonTree data={props.data}
        getArrowStyle={(type, expanded) => (styles.arrow)}
        getListStyle={(type, expanded) => (styles.list)}
        getLabelStyle={(type, expanded) => (styles.label)}
        getValueStyle={(type, expanded) => (styles.value)} />
    );
  }
}

export default JsonWidget;
