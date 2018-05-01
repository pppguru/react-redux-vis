import React, {PropTypes} from 'react';

export class NoDataWidget extends React.Component {
  static propTypes = {
    style: PropTypes.object
  }

  render() {
    const {props: {style}} = this;
    return (<div style={style || {}}>No Data Found.</div>);
  }
}

export default NoDataWidget;
