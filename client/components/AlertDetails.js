import React, {PropTypes} from 'react';
import SummaryWidget from 'components/widgets/SummaryWidget';
import {
  formatDateInLocalTimeZone
} from '../../commons/utils/utils';

const styles = {
  card: {
    fontSize: '13px'
  },
  section: {
    paddingTop: '35px'
  },
  item: {
    padding: '3px'
  },
  itemTitle: {
    width: '100px',
    fontSize: '13px',
    display: 'inline-block',
    fontWeight: 'bold',
    margin: 0
  },
  error: {
    textAlign: 'center',
    marginBottom: '30px'
  }
};

class AlertDetails extends React.Component {
  static propTypes = {
    data: PropTypes.object
  }

  render() {
    let {data} = this.props;
    if (!data) return null;

    data = data.data.rank_alert;

    let {date, time} = formatDateInLocalTimeZone(data.created);

    return (
      <div style={styles.card}>
        <SummaryWidget data={data} />
        <div style={styles.section}>
          <h5 style={styles.itemTitle}>
            DATE & TIME
          </h5>
          <div>
            {date}
            <span>&nbsp;&nbsp;&nbsp;</span>
            {time}
          </div>
        </div>
      </div>
    );
  }
}

AlertDetails.contextTypes = {
  store: React.PropTypes.object
};

export default AlertDetails;
