import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import PercentageWidget from 'components/widgets/PercentageWidget';

const styles = {
  pieWrap: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    margin: '0px',
    justifyContent: 'center',
    height: '400px',
    marginTop: '-30px'
  },
  legends: {
    title: {
      fontSize: '13px',
      color: Colors.pebble
    },
    label: {
      fontSize: '13px',
      color: Colors.smoke,
      paddingTop: '20px',
      paddingBottom: '20px'
    },
    percentage: {
      fontSize: '35px',
      color: Colors.bar
    }
  }
};

const chartOptions = {
  showBorder: 0,
  use3DLighting: 0,
  enableSmartLabels: 0,
  showLabels: 0,
  showPercentValues: 0,
  showTooltip: 0,
  decimals: 0,
  paletteColors: Colors.cloud + ',' + Colors.bar,
  theme: 'fint',
  chartTopMargin: 0,
  chartLeftMargin: 0,
  chartRightMargin: 0,
  chartBottomMargin: 0,
  bgcolor: Colors.white,
  showValues: 0,
  startingAngle: 90,
  enableRotation: 0,
  enableSlicing: 0,
  animation: 0
};

class PieChart extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    attributes: PropTypes.object
  }

  renderChart() {
    const {props: {attributes, data}} = this,
      {pieProps: {piePercentage}, pieJson: {chart}} = data;

    const dataSource = {
      chart: Object.assign({}, chartOptions, chart.options),
      data: [
        {
          value: 100 - parseInt(piePercentage)
        },
        {
          value: parseInt(piePercentage)
        }
      ],
      annotations:
      {
        showBelow: 0,
        groups: [
          {
            items: [
              {
                id: 'percentage-label',
                type: 'text',
                text: piePercentage + '%',
                color: Colors.white,
                x: 180,
                y: 75
              }
            ]
          }
        ]
      }
    };
    FusionCharts.ready(function() {
      let fusioncharts = new FusionCharts({
        type: 'doughnut2d',
        renderAt: attributes.id,
        width: 310,
        height: 310,
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource
      });
      fusioncharts.render();
    });
  }

  render() {
    const {props} = this;

    if (!props.data || !props.data.pieProps) {
      return (<div />);
    }

    // Here, pieProps and pieJson are coming from PieChart data abstraction layer, hence it is in 'data' object.
    const {attributes, data: {pieProps, pieJson: {chart: {legends}}}} = props;

    if (pieProps.piePercentage === '0' && pieProps.assetPercentage === '0') {
      return (<div>No Data Found.</div>);
    }

    return (
      <div style={styles.pieWrap}>
        <div id={attributes.id} style={{marginLeft: '-20px'}}>
          {this.renderChart(pieProps)}
        </div>
        <div style={{paddingLeft: '20px', paddingRight: '20px'}}>
          <PercentageWidget iconName='desktop_mac' percentage={pieProps.assetPercentage} />
        </div>
        <div>
          <ul style={{listStyle: 'none'}}>
            <li style={styles.legends.percentage}>{pieProps.piePercentage}%</li>
            <li style={styles.legends.title}>{legends.title[0]}</li>
            <li style={styles.legends.label}>{legends.label}</li>
            <li style={styles.legends.percentage}>{pieProps.assetPercentage}%</li>
            <li style={styles.legends.title}>{legends.title[1]}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default PieChart;
