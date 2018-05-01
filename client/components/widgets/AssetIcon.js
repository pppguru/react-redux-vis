import React, { PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';

import {Colors} from '../../../commons/colors';

const styles = {
  icon: {
    fontSize: '24px'
  },
  imgWrap: {
    fontSize: '24px',
    fontWeight: '100',
    backgroundColor: Colors.iconBackground,
    color: Colors.white,
    height: '45px',
    width: '45px',
    lineHeight: '45px',
    borderRadius: '50%',
    textAlign: 'center',
    marginRight: '10px'
  }
};

class AssetIconWidget extends React.Component {
  static propTypes = {
    asset: PropTypes.object.isRequired
  }

  getImage() {
    const {asset} = this.props;
    if (asset.type === 'user') {
      const name = asset.info.name;

      return (
        <div style={styles.imgWrap}>
          {name[0].toUpperCase()}
        </div>
      );
    }
    else if (asset.type === 'ip') {
      return (
        <div>
          <FontIcon style={{...styles.imgWrap, ...styles.icon}} className='material-icons'>language</FontIcon>
        </div>
      );
    }
    else if (asset.type === 'host' || asset.type === 'machine') {
      return (
        <div>
          <FontIcon style={{...styles.imgWrap, ...styles.icon}} className='material-icons'>desktop_mac</FontIcon>
        </div>
      );
    }

    return null;
  }

  render() {
    return this.getImage();
  }
}

export default AssetIconWidget;
