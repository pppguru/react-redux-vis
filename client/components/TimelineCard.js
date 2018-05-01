import React, {PropTypes} from 'react';
import Card from 'material-ui/Card/Card';
import { Colors, BarColorShade3, BarColorShade5 } from '../../commons/colors';
import {getColor} from '../../commons/utils/colorUtils';
import {getCountryName} from '../../commons/utils/countryUtils';
import {isEmpty} from '../../commons/utils/utils';
import MultiSeriesCombiChart from 'components/charts/MultiSeriesCombiChart';
import JsonTree from './widgets/JsonTreeWidget';

let styles = {
  list: {
    width: '100%'
  },
  listItem: {
    fontSize: '13px',
    color: Colors.grape
  },
  title: {
    'fontSize': '13px',
    'fontWeight': 600,
    'margin': 0,
    'paddingBottom': '10px'
  },
  timelineCard: {
    boxShadow: '0px',
    paddingTop: '22px',
    paddingBottom: '22px',
    paddingLeft: '18px',
    paddingRight: '18px',
    height: 'auto',
    fontSize: '14px',
    overflowWrap: 'break-word',
    marginBottom: '20px'
  },
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

function getSourceDestination(data) {
  if (data.ip) {
    let country = data.country ? getCountryName[data.country.toUpperCase()] : '';
    return (
      <span>
        <span> {data.ip} </span>
        {
          data.country
          ? <span className={'flag-icon flag-icon-' + data.country.toLowerCase()} rel='tooltip'
            title={country} />
          : null
        }
        {
          data.port > 0
          ? <span> on Port {data.port}</span>
          : null
        }
      </span>
    );
  }
  return null;
}

function getDetailsArrow(selected) {
  let arrowName = selected ? 'right-arrow-dark' : 'right-arrow-light',
    arrowPath = '/img/' + arrowName + '.png';
  return (
    <div style={{marginLeft: 'auto'}}>
      <img src={arrowPath} />
    </div>
  );
}

class TimelineCard extends React.Component {
  static propTypes = {
    data: PropTypes.object,
    broadcastEvent: PropTypes.func
  }

  constructor(props) {
    super(props);

    this.cardType = '';
    this.clickCards = ['Anomaly', 'Rank Alert', 'Session'];
    this.loadDetailsCards = ['Anomaly', 'Session'];
    this.isClickCard = false;
    this.isLoadDetails = false;
    this.displayFlex = {};

    this.handleCardClick = this.handleCardClick.bind(this);
  }

  getDetails(data) {
    if (!data) {
      return;
    }

    if (isEmpty(data.display)) {
      return (
        <li style={{...styles.listItem}}>
          <div>Type: {data.Type}</div>
          <div style={{marginLeft: '-15px'}}>
            <JsonTree data={data.json} />
          </div>
        </li>
      );
    }
    else {
      return (
        Object.keys(data.display).map((key, index) => {
          if (key === 'sourceDest') {
            return this.getSourceDestination(data);
          }
          else if (key === 'summary') {
            return (
              <li style={{...styles.listItem}} key='summary'>
                {
                  data.display.summary.Internal
                  ? this.displayInOutSummary(data.display.summary.Internal, 'Internal')
                  : null
                }
                {
                  data.display.summary.External
                  ? this.displayInOutSummary(data.display.summary.External, 'External')
                  : null
                }
              </li>
            );
          }
          return this.displayDetails(key, index, data);
        })
      );
    }
  }

  displayDetails(key, index, data) {
    let fontWeight = (index === 0) ? 'bold' : '',
      currentDetails = data.display[key];

    if (data.isIconDisplay && index === 1) {
      styles.listItem = Object.assign({}, styles.listItem, {paddingTop: '5px'});
    }
    else {
      styles.listItem = Object.assign({}, styles.listItem, {paddingTop: '0px'});
    }

    if (currentDetails.value !== '') {
      return (
        <li style={{...styles.listItem, fontWeight}} key={`desc${index}`}>
          {currentDetails.displayKey ? key + ':' : ''} {currentDetails.value}
        </li>
      );
    }
    return null;
  }

  displayInOutSummary(data, type) {
    return (
      <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
        <div style={{width: '20%', whiteSpace: 'nowrap'}}>{type}:</div>
        <div><img src='/img/incoming-bandwidth.png' /></div>
        <div style={{width: '20%', whiteSpace: 'nowrap'}}>{data.IncomingBandwidth}</div>
        <div><img src='/img/outgoing-bandwidth.png' /></div>
        <div style={{width: '20%', whiteSpace: 'nowrap'}}>{data.OutgoingBandwidth}</div>
        <div><img src='/img/machines.png' /></div>
        <div style={{width: '10%', whiteSpace: 'nowrap'}}>{data.Machines}</div>
        <div><img src='/img/connections.png' /></div>
        <div style={{width: '10%', whiteSpace: 'nowrap'}}>{data.Connections}</div>
      </div>
    );
  }

  getSourceDestination(data) {
    let {display: {sourceDest}, id} = data,
      source = sourceDest.source ? sourceDest.source : {},
      dest = sourceDest.dest ? sourceDest.dest : {};
    return (
      <li style={{...styles.listItem}} key={'sourceDest' + id}>
        <div style={{fontWeight: '600', ...this.displayFlex}}>
          {sourceDest.source ? getSourceDestination(source) : null}
          {sourceDest.dest ? getSourceDestination(dest) : null}
        </div>
      </li>
    );
  }

  toggleHighlightNetworkNode(id) {
    this.props.broadcastEvent('network-graph', {id});
  }

  handleCardClick() {
    const {props} = this;
    let details = {
      selectedCardId: '',
      eventDate: ''
    };
    return () => {
      switch (this.cardType) {
        case 'Rank Alert':
          const url = `/alert/${props.data.id}/${props.data.Date}`;
          props.updateRoute(url);
          break;
        case 'Anomaly': {
          props.setAutoScroll(true);

          if (props.selectedCardId !== props.data.id) {
            details = {
              selectedCardId: props.data.id,
              eventDate: props.data.Date
            };
            this.toggleHighlightNetworkNode(props.data.id);
          }
          else {
            details = {
              selectedCardId: '',
              eventDate: ''
            };
            this.toggleHighlightNetworkNode('');
          }
          props.getContextualMenuApiObj(details);
          break;
        }
        case 'Session':
          if (props.selectedCardId !== props.data.id) {
            let user = '',
              machine = '';
            if (props.data.display.User) {
              user = props.data.display.User.value;
            }
            else if (props.data.User) {
              user = props.data.User;
            }
            if (props.data.display.Machine) {
              machine = props.data.display.Machine.value;
            }
            else if (props.data.Machine) {
              machine = props.data.Machine;
            }
            details = {
              id: props.id,
              selectedCardId: props.data.id,
              eventDate: props.data.Date,
              user: user,
              machine: machine,
              start: props.data.Date ? props.data.Date : '',
              end: props.data.endDate ? props.data.endDate : ''
            };
          }
          props.getContextualMenuApiObj(details);
          break;
        default:
          break;
      }
    };
  }

  displayIcon(icon) {
    let value = icon.name.toLowerCase();
    return (
      <div>
        {
          (value.includes('snoop'))
          ? <img src='/img/anomaly/snoop.png' />
          : (value.includes('exfiltration') || value.includes('exfiltrate'))
            ? <img src='/img/anomaly/exfiltration.png' />
            : (value.includes('command and control'))
              ? <img src='/img/anomaly/command-control.png' />
              : icon.type === 'machine'
                ? <i style={{...styles.imgWrap, ...styles.icon}} className='material-icons'>{icon.name}</i>
                : icon.type === 'user'
                  ? <div style={styles.imgWrap}>{icon.name}</div>
                  : null
        }
      </div>
    );
  }

  getAnomalyChart() {
    const {props} = this,
      {id, attributes, chart, data} = props,
      chartData = data.chart,
      chartProps = {
        attributes: {
          id,
          ...attributes.chart
        },
        processedData: true
      },
      uiConfig = chartData.uiConfig;

    chartData.chart = Object.assign(chart.chartOptions, {
      divlineThickness: 1,
      xAxisName: uiConfig.xAxisLabel,
      yAxisName: uiConfig.yAxisLabel || 'Log Scale',
      canvasBgColor: 'transparent',
      bgColor: 'transparent'
    });

    chartProps.data = JSON.parse(JSON.stringify(chartData));
    delete chartProps.data.uiConfig;

    return (
      <div>
        <h2 style={styles.title}>{uiConfig.title}</h2>
        <MultiSeriesCombiChart {...chartProps} />
      </div>
    );
  }

  getAlertBorder(data) {
    let isAlert = (this.cardType === 'Alert' || this.cardType === 'Rank Alert') ? 'alert' : 'other',
      borderStyle = {
        paddingLeft: '22px'
      };

    if (isAlert === 'alert') {
      let score = data.display.Score ? data.display.Score.value : '',
        severity = data.display.Severity ? data.display.Severity.value : '';

      borderStyle = {
        borderLeft: `5px solid ${getColor(score, severity)}`,
        paddingLeft: '17px'
      };
    }
    else if (this.cardType !== 'Session' && this.cardType !== 'Anomaly') {
      return {
        borderLeft: `5px solid ${Colors.bar}`,
        paddingLeft: '17px'
      };
    }

    return borderStyle;
  }

  getCardType(data) {
    let cardType = '';
    if (data.Type) {
      cardType = data.Type;
    }
    else if (data.display.Type) {
      cardType = data.display.Type;
    }
    return cardType;
  }

  render() {
    const {props, props: {data}} = this;
    this.cardType = this.getCardType(data);
    this.isClickCard = this.clickCards.includes(this.cardType);
    this.isLoadDetails = this.loadDetailsCards.includes(this.cardType);
    this.displayFlex = data.isIconDisplay || this.isLoadDetails ? {display: 'flex'} : {};
    const alertStyle = this.getAlertBorder(data);

    if (props.data.chart) {
      styles.list = Object.assign({}, styles.list, {paddingLeft: '15px'});
    }
    else {
      styles.list = Object.assign({}, styles.list, {paddingLeft: '0px'});
    }

    let selectedCardStyle = { boxShadow: 'none' };
    if (props.selectedCardId === props.data.id) {
      selectedCardStyle = Object.assign({}, {
        border: `1px solid ${BarColorShade3}`,
        boxShadow: `0 0 Colors, BarColorShade3${BarColorShade5}`
      });
    }

    let cardWidth = '350px';
    if (props.data.chart) { // if card contains chart (e.g. Anomaly Chart)
      cardWidth = '800px';
    }
    else if (props.data.display && props.data.display.summary) { // if card contains In and Out Summary of Session
      cardWidth = '400px';
    }

    const style = Object.assign({},
      styles.timelineCard,
      alertStyle,
      {
        width: cardWidth,
        cursor: this.isClickCard ? 'pointer' : 'auto'
      },
      selectedCardStyle
    ); // These widths are not provided by Rose.

    return (
      <Card style={style}
        onClick={this.handleCardClick()}
        key={data.id}>
        <div style={{display: 'flex'}}>
          {
            props.data.chart
            ? this.getAnomalyChart(props.data.chart)
            : null
          }
          {data.isIconDisplay ? this.displayIcon(data.icon) : null}
          <ul className='no-list-style' style={styles.list}>
            {this.getDetails(props.data)}
          </ul>
          {
            this.isLoadDetails
            ? props.selectedCardId !== '' && props.selectedCardId === props.data.id
              ? getDetailsArrow(true)
              : getDetailsArrow(false)
            : null
          }
        </div>
      </Card>
    );
  }
}

export default TimelineCard;
