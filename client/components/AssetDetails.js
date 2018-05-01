import React, {PropTypes} from 'react';

import RadarChart from 'components/charts/RadarChart';
import Heatmap from 'components/charts/Heatmap';
import AssetWidget from 'components/widgets/AssetWidget';
import ScoreWidget from 'components/widgets/ScoreWidget';

import FontIcon from 'material-ui/FontIcon';
import {Colors} from '../../commons/colors';

import {formatBytes} from '../../commons/utils/utils';
import {getColor} from '../../commons/utils/colorUtils';
import {getCountryName} from '../../commons/utils/countryUtils';
import {getArrowIcon} from '../../commons/utils/graphUtils';

const styles = {
  assetWidget: {
    overflowWrap: 'break-word',
    width: '180px',
    padding: 0
  },
  rankScore: {
    height: '45px',
    width: '45px',
    lineHeight: '45px',
    fontSize: '20px',
    marginRight: '10px',
    border: 'none',
    boxShadow: 'none'
  },
  scoreDetails: {
    display: 'flex',
    marginTop: '30px',
    cursor: 'pointer'
  },
  scoreDesc: {
    display: 'inline-flex',
    flexGrow: 1
  },
  scoreIcon: {
    marginTop: 0,
    lineHeight: '12px',
    height: '12px',
    width: '16px',
    marginLeft: 'auto'
  },
  sessionIcon: {
    marginTop: 0,
    lineHeight: '18px',
    height: '18px',
    width: '16px',
    marginLeft: '5px'
  },
  chart: {
    position: 'absolute',
    backgroundColor: Colors.cloud,
    left: 0,
    right: 0
  },
  list: {
    listStyleType: 'none',
    fontSize: '13px',
    padding: 0,
    margin: 0
  },
  item: {
    display: 'flex',
    paddingTop: '5px'
  },
  title: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'capitalize',
    margin: 0
  },
  subTitle: {
    fontSize: '11px',
    fontWeight: '300'
  },
  titleValue: {
    fontSize: '18px'
  },
  value: {
    fontSize: '16px',
    marginLeft: 'auto'
  },
  heading: {
    fontWeight: 'normal',
    margin: 0
  },
  text: {
    fontSize: '11px',
    textTransform: 'uppercase',
    paddingLeft: '2px',
    fontWeight: '600'
  },
  icon: {
    fontSize: '16px',
    width: '12px',
    lineHeight: '14px',
    marginTop: 'auto'
  },
  change: {
    fontSize: '11px',
    fontWeight: 'bold',
    marginLeft: '15px',
    display: 'inline-flex',
    textAlign: 'right'
  },
  percent: {
    width: '40px'
  }
};

class AssetDetail extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    chart: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      radarChartOpen: false,
      sessionChartOpen: false
    };
  }

  getValue(data) {
    return (data && data.rows && data.rows.length === 1)
      ? {
        value: data.rows[0][0][0],
        change: data.rows[0][0][2]
      }
      : {value: 0, change: 0};
  }

  getChangeElement(change) {
    let formattedChange;
    if (typeof change === 'number') {
      formattedChange = parseFloat(change).toFixed(2);
    }
    else {
      formattedChange = 0;
    }

    return (
      <span style={styles.change}>
        <span style={styles.percent}>{Math.abs(formattedChange)} %</span>
        {getArrowIcon(change, styles.icon)}
      </span>
    );
  }

  getElement(report, index) {
    let value = '', change = null;

    if (report.value !== undefined && report.value !== null) {
      value = report.value.value;
      change = report.value.change;
    }

    if (report.title) {
      const listItemStyle = report.subTitle ? {display: 'block'} : {};
      return (
        <li style={{...styles.item, ...listItemStyle, paddingTop: '30px'}} key={`assetDetail${index}`}>
          <h3 style={styles.title}>{report.title}</h3>
          {
            report.subTitle
            ? <div style={styles.subTitle}>{report.subTitle}</div>
            : (
              <div style={{marginLeft: 'auto'}}>
                <span style={{...styles.value, ...styles.titleValue}}>{value}</span>
                {
                  typeof change === 'number'
                  ? this.getChangeElement(change)
                  : null
                }
              </div>
            )
          }
        </li>
      );
    }
    else {
      return (
        <li style={styles.item} key={`assetDetail${index}`}>
          <h3 style={styles.heading}>{report.heading}</h3>
          <div style={{marginLeft: 'auto'}}>
            <span style={styles.value}>{value}</span>
            {
              typeof change === 'number'
              ? this.getChangeElement(change)
              : null
            }
          </div>
        </li>
      );
    }
  }

  getReports(reports) {
    const details = [];

    let value = this.getValue(reports.taf_asset_internal_resource_count_time_shifted);
    details.push({
      title: 'assets accessed',
      value
    });

    details.push({
      title: 'Incoming Bandwidth',
      value: null
    });

    value = this.getValue(reports.taf_asset_total_incoming_bandwidth_external_time_shifted);
    value.value = formatBytes(value.value, 2, {numberStyle: styles.value, textStyle: styles.text});
    details.push({
      heading: 'External',
      value
    });

    value = this.getValue(reports.taf_asset_total_incoming_bandwidth_internal_time_shifted);
    value.value = formatBytes(value.value, 2, {numberStyle: styles.value, textStyle: styles.text});
    details.push({
      heading: 'Internal',
      value
    });

    details.push({
      title: 'Outgoing Bandwidth',
      value: null
    });

    value = this.getValue(reports.taf_asset_total_outgoing_bandwidth_external_time_shifted);
    value.value = formatBytes(value.value, 2, {numberStyle: styles.value, textStyle: styles.text});
    details.push({
      heading: 'External',
      value
    });

    value = this.getValue(reports.taf_asset_total_outgoing_bandwidth_internal_time_shifted);
    value.value = formatBytes(value.value, 2, {numberStyle: styles.value, textStyle: styles.text});
    details.push({
      heading: 'Internal',
      value
    });

    details.push({
      title: 'Destination Countries',
      subTitle: '(number of connections)',
      value: null
    });

    reports.taf_asset_top_dest_countries.rows.forEach(([country, count]) => {
      details.push({
        heading: getCountryName[country],
        value: {value: count.toLocaleString()}
      });
    });

    details.push({
      title: 'Source Countries',
      subTitle: '(number of connections)',
      value: null
    });

    reports.taf_asset_top_source_countries.rows.forEach(([country, count]) => {
      details.push({
        heading: getCountryName[country],
        value: {value: count.toLocaleString()}
      });
    });

    return details.map((report, index) => this.getElement(report, index));
  }

  toggleChart(type) {
    return () => {
      if (this.state[type]) {
        this.setState({[type]: false});
      }
      else {
        this.setState({[type]: true});
      }
    };
  }

  getRadarChart() {
    const {data: {assetDetail}, chart: {radarChartOptions}} = this.props,
      {risk: {score}} = assetDetail;

    radarChartOptions.paletteColors = getColor(score);

    const radarChartProps = {
      chart: {
        options: radarChartOptions,
        width: '100%',
        height: '240'
      },
      attributes: {
        style: styles.chart,
        id: 'score-justification'
      },
      data: assetDetail.risk.scoreDetails
    };

    let chartWrapStyle = { display: 'none' },
      iconStyle = {...styles.icon, ...styles.scoreIcon, transition: 'transform .3s'};

    if (this.state.radarChartOpen) {
      chartWrapStyle = Object.assign({}, chartWrapStyle, {height: '220px', marginTop: '15px', display: 'block'});
      iconStyle = Object.assign({}, iconStyle, {transform: 'rotate(180deg)'});
    }

    return (
      <div>
        <div style={styles.scoreDetails} onClick={this.toggleChart('radarChartOpen')}>
          <ScoreWidget scoreValue={assetDetail.risk.score} style={styles.rankScore} hideArrow />
          <div style={styles.scoreDesc}>
            <h3 style={{...styles.title, ...styles.scoreTitle}}>Score</h3>
            <FontIcon style={iconStyle} className='material-icons'>
              arrow_drop_down
            </FontIcon>
          </div>
        </div>
        <div style={chartWrapStyle}>
          <RadarChart {...radarChartProps} />
        </div>
      </div>
    );
  }

  getSessionChart() {
    const props = {
      chart: {
        options: this.props.chart.sessionChartOptions,
        containerBackgroundOpacity: 0,
        width: '100%',
        height: '350'
      },
      attributes: {
        style: styles.chart,
        id: 'session-chart'
      },
      data: this.props.data.sessionDetail
    };

    const {assetReports: reports} = this.props.data;
    let {change, value} = this.getValue(reports.taf_asset_session_count_time_shifted);

    let chartWrapStyle = { display: 'none' },
      iconStyle = {...styles.icon, ...styles.sessionIcon, transition: 'transform .3s'};

    if (this.state.sessionChartOpen) {
      chartWrapStyle = Object.assign({}, chartWrapStyle, {height: '350px', marginTop: '15px', display: 'block'});
      iconStyle = Object.assign({}, iconStyle, {transform: 'rotate(180deg)'});
    }

    return (
      <div>
        <div style={{...styles.item, paddingTop: '30px', cursor: 'pointer'}}
          onClick={this.toggleChart('sessionChartOpen')}>
          <div style={{...styles.scoreDesc, margin: 'auto'}}>
            <h3 style={{...styles.title, ...styles.scoreTitle}}>Session</h3>
            <FontIcon style={iconStyle} className='material-icons'>
              arrow_drop_down
            </FontIcon>
          </div>
          <div style={{marginLeft: 'auto'}}>
            <span style={{...styles.value, ...styles.titleValue}}>{value}</span>
            {this.getChangeElement(change)}
          </div>
        </div>
        <div style={chartWrapStyle}>
          <Heatmap {...props} />
        </div>
      </div>
    );
  }

  render() {
    let {data} = this.props;
    if (!data) return null;

    const {assetDetail, assetReports} = data;

    return (
      <div style={styles.card}>
        <AssetWidget data={assetDetail} style={{padding: 0}} headingStyle={styles.assetWidget} />

        {this.getRadarChart()}

        {this.getSessionChart()}

        <ul style={styles.list}>
          {this.getReports(assetReports)}
        </ul>
      </div>
    );
  }
}

export default AssetDetail;
