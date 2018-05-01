import React, { PropTypes } from 'react';
import AssetIcon from 'components/widgets/AssetIcon';

import {Colors} from '../../../commons/colors';

const styles = {
  wrap: {
    display: 'flex',
    padding: '10px 0',
    color: Colors.grape
  },
  heading: {
    textTransform: 'capitalize',
    fontSize: '14px',
    fontWeight: '600'
  },
  subHeading: {
    textTransform: 'capitalize',
    fontWeight: 'light',
    overflowWrap: 'break-word'
  }
};

class AssetWidget extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const {props} = this,
      info = props.data.info;

    const headingStyle = {...styles.heading, ...props.headingStyle};
    if (!info.title) {
      headingStyle.paddingTop = '5px';
    }

    return (
      <div style={{...styles.wrap, ...props.style}}>
        <AssetIcon asset={props.data} />
        <div>
          <div style={headingStyle}>{info.displayName}</div>
          {info.title ? <div style={styles.subHeading}>{info.title}</div> : null}
          {info.department ? <div style={styles.subHeading}>{info.department}</div> : null}
          {info.servicePack ? <div style={styles.subHeading}>{info.servicePack}</div> : null}
          {info.OS ? <div style={styles.subHeading}>{info.OS}</div> : null}
        </div>
      </div>
    );
  }
}

export default AssetWidget;
