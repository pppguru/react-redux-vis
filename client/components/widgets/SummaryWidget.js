import React, {PropTypes} from 'react';
import ScoreWidget from 'components/widgets/ScoreWidget';

const styles = {
  wrap: {
    display: 'flex'
  },
  summaryTitle: {
    margin: 0,
    fontWeight: 'bold',
    fontSize: '13px'
  },
  rankScore: {
    flex: '0 0 45px',
    height: '45px',
    width: '45px',
    lineHeight: '45px',
    fontSize: '20px',
    border: 'none',
    boxShadow: 'none'
  },
  summaryWrap: {
    marginLeft: '10px'
  },
  text: {
    wordBreak: 'break-word'
  }
};

class SummaryWidget extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const {props: {data}} = this;

    return (
      <div style={styles.wrap}>
        <ScoreWidget style={styles.rankScore} scoreValue={data.score} hideArrow />
        <div style={styles.summaryWrap}>
          <h5 style={styles.summaryTitle}>
            Summary
          </h5>
          <div style={styles.text}>
            {data.message}
          </div>
        </div>
      </div>
    );
  }
}

export default SummaryWidget;
