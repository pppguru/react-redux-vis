import React from 'react';
import ParentCard from 'containers/ParentCard';
import MetricsCard from 'components/MetricsCard';
import { Colors } from '../../commons/colors';

const styles = {
  wrap: {
    display: 'flex',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    boxShadow: `1px 1px 1px 1px ${Colors.shadow}`
  }
};

class MetricsBar extends React.Component {
  static propTypes = { }

  render() {
    const { props } = this;

    return (
      <div style={styles.wrap}>
        {props.childrenComponent.map(child => {
          return (
            <ParentCard {...child} key={child.id} history={props.history}>
              <MetricsCard />
            </ParentCard>
          );
        })}
      </div>
    );
  }
}

export default MetricsBar;
