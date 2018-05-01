import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Colors} from '../../commons/colors';

const styles = {
  tab: {
    backgroundColor: Colors.cloudShades[0],
    color: Colors.grape
  }
};

class TabsWidget extends React.Component {
  handleTabChange = (value) => {
    const {props} = this;
    props.onTabChange(value);
  };

  render() {
    const {props} = this;
    return (
      <Tabs style={props.style}>
        {
          props.tabs.map((tab, index) => {
            return (
              <Tab key={index} label={tab} style={styles.tab} onActive={props.onTabChange}>
                <div />
              </Tab>
            );
          })
        }
      </Tabs>
    );
  }
}

export default TabsWidget;
