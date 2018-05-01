import React, {PropTypes} from 'react';
import WorldMapLegends from './WorldMapLegends';
import NoDataWidget from '../widgets/NoDataWidget';
import {Colors} from '../../../commons/colors';
import {
  generateRawData,
  isZero,
  isNull,
  isEmpty,
  isNotNA,
  isBetween,
  getColumnIndexes
} from '../../../commons/utils/utils';
import {getColorRanges} from '../../../commons/utils/colorUtils';
import {getCountryId} from '../../../commons/utils/countryUtils';
import {getQueryParamsForDetails} from '../../utils/utils';
import {
  DEFAULT_CHART_OPTIONS,
  DEFAULT_CHART_DIMENSIONS
} from 'Constants';

const styles = {
    subTitle: {
      fontSize: '14px',
      color: Colors.grape,
      fontWeight: 'normal',
      position: 'absolute'
    }
  },
  chartOptions = Object.assign({}, DEFAULT_CHART_OPTIONS, {
    'entityFillHoverColor': Colors.smoke,
    'nullEntityColor': Colors.smoke,
    'showLabels': '0',
    'theme': 'zune',
    'showvalue': '0',
    'showLegend': '0',
    'chartLeftMargin': '0',
    'chartRightMargin': '0',
    'chartTopMargin': '0',
    'chartBottomMargin': '0',
    'bgAlpha': '0',
    'canvasTopMargin': '0',
    'canvasBottomMargin': '0',
    'toolTipSepChar': ' | '
  });

export function getConnections(rows, fieldMap, columnIndex) {
  let secure = [],
    malicious = [];

  rows.forEach((row) => {
    if (isNotNA(row[columnIndex.x]) && isNotNA(row[columnIndex.y])) {
      let value = row[columnIndex.connections];
      if (!isNull(value) && !isZero(value)) {
        if (fieldMap.connection === 'secure') {
          secure.push(value);
        }
        else if (fieldMap.connection === 'malicious') {
          malicious.push(value);
        }
      }
    }
  });

  return {
    secure,
    malicious
  };
}

export function getColorObj(colorRanges, value, type) {
  let colorObj = {},
    colorRange = colorRanges[type] || [];
  colorRange.forEach((range) => {
    if (isBetween(parseInt(value), range.min, range.max)) {
      colorObj = Object.assign({}, colorObj, {
        color: range.color,
        connection: type
      });
      return false;
    }
  });
  return colorObj;
}

export function generateDataSource(rawData, chart) {
  const {options, data: {fieldMapping}} = chart;
  let dataObject = [],
    secureConnections = [],
    maliciousConnections = [];

  fieldMapping.forEach((fieldMap) => {
    let {rows, columns} = rawData[fieldMap.reportId],
      columnIndex = getColumnIndexes(fieldMap.columns, columns);

    // Get column data
    if (!isEmpty(columnIndex)) {
      let connectionValues = getConnections(rows, fieldMap, columnIndex),
        {secure, malicious} = connectionValues;

      secureConnections = Object.assign([], secureConnections, secure);
      maliciousConnections = Object.assign([], maliciousConnections, malicious);

      let colorRanges = getColorRanges(secureConnections, maliciousConnections);

      rows.forEach((row) => {
        let dataObj = {};
        if (isNotNA(row[columnIndex.x]) && isNotNA(row[columnIndex.y])) {
          let countryCode = row[columnIndex.country],
            value = row[columnIndex.connections];
          if (fieldMap.connection === 'secure' || fieldMap.connection === 'malicious') {
            dataObj = Object.assign({}, dataObj, {
              id: getCountryId(countryCode),
              countryCode,
              value: value ? value.toString() : ''
            });
            if (!isNull(value) && !isZero(value)) {
              let colorObj = getColorObj(colorRanges, value, fieldMap.connection);
              dataObj = Object.assign({}, dataObj, colorObj);
              dataObject.push(dataObj);
            }
          }
        }
      });
    }
  });

  return {
    chart: Object.assign({}, chartOptions, options),
    data: [{data: dataObject}]
  };
}

class WorldMap extends React.Component {
  static propTypes = {
    meta: PropTypes.object.isRequired,
    attributes: PropTypes.object.isRequired,
    chart: PropTypes.object.isRequired
  }

  renderChart() {
    const {props} = this,
      {data, showDetailsTable, attributes, details, chart} = props,
      fieldMapping = chart.data.fieldMapping;

    const rawData = generateRawData(fieldMapping, data),
      dataSource = generateDataSource(rawData, chart);

    if (isEmpty(dataSource.data[0].data)) { // data[0].data is the fusion charts required format for world maps.
      return (<NoDataWidget style={{marginTop: '20px'}} />);
    }

    FusionCharts.ready(function() {
      const fusioncharts = new FusionCharts({
        type: 'maps/worldwithcountries',
        renderAt: attributes.id,
        width: chart.width || DEFAULT_CHART_DIMENSIONS.width,
        height: chart.height || DEFAULT_CHART_DIMENSIONS.height,
        dataFormat: 'json',
        containerBackgroundOpacity: '0',
        dataSource,
        events: {
          entityClick: function(eventObj, dataObj) {
            let queryParams = getQueryParamsForDetails(details.meta.queryParams, dataObj);
            showDetailsTable && showDetailsTable(queryParams);
          }
        }
      });
      fusioncharts.render();
    });
  }

  render() {
    const {props, props: {meta, attributes, chart}} = this,
      minHeight = {minHeight: chart.height + 'px'};

    if (!props.data) {
      return (<div />);
    }

    return (
      <div>
        <div style={{...styles.subTitle}}>
          {meta.subTitle}
        </div>

        <div id={attributes.id} style={{...minHeight, paddingTop: '10px'}}>
          {this.renderChart()}
        </div>

        <WorldMapLegends style={attributes.legendStyle} />
      </div>
    );
  }
}

WorldMap.contextTypes = {
  clickThrough: React.PropTypes.func
};

export default WorldMap;
