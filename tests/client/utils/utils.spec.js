import {
  msToTime,
  generateRawData,
  getIndexFromColumnName,
  getColumnIndexArrayFromColumnName,
  getXYIndexFromColumnNames,
  getIndexFromObjectName,
  translateTimeWindow,
  isUndefined,
  getTimePairFromWindow
} from '../../../commons/utils/utils';

import { getColorRanges } from '../../../commons/utils/colorUtils';

describe('Utility Function:', function() {
  it('msToTime should convert milliseconds to time.', function() {
    expect(msToTime('605168257')).to.deep.equal({'timeArray': ['00', '06', '08'], 'timeString': '00 : 06 : 08'});
  });

  it('generateRawData should generate raw data object.', function() {
    const fieldMapping = [{
        'reportId': 'taf_top_longest_user_agents',
        'columns': [
          {
            'type': 'text', 'columnNameToDisplay': 'User Agent',
            'data': [{'fieldName': 'data.http.userAgent'}], 'style': {'width': '70%'}
          },
          {
            'type': 'chart', 'columnNameToDisplay': 'Connections',
            'attributes': {'id': 'connection', 'chartType': 'area2d', 'chartWidth': '100%', 'chartHeight': '75'},
            'data': [{'fieldName': 'count'}], 'style': {'width': '30%'}
          }
        ]
      }],
      apiData = {'taf_top_longest_user_agents': {'total': -1, 'next': -1, 'columns': [{'name': 'data.http.userAgent', 'displayName': 'data.http.userAgent', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'date', 'displayName': 'date', 'columnType': 'DIMENSION', 'dataType': 'DATE', 'sortable': true}, {'name': 'count', 'displayName': 'connections', 'columnType': 'MEASURE', 'dataType': 'NUMBER', 'sortable': true}], 'rows': [{'Jakarta Commons-HttpClient/3.1': {'2016-06-23T09:25:00.000': [0], '2016-06-23T10:00:00.000': [0], '2016-06-23T09:35:00.000': [0], '2016-06-23T10:10:00.000': [7], '2016-06-23T09:30:00.000': [0], '2016-06-23T10:05:00.000': [0], '2016-06-23T09:45:00.000': [0], '2016-06-23T09:40:00.000': [0], '2016-06-23T10:15:00.000': [0], '2016-06-23T09:20:00.000': [0], '2016-06-23T09:55:00.000': [0], '2016-06-23T09:15:00.000': [0], '2016-06-23T09:50:00.000': [0]}}]}, 'taf_top_shortest_user_agents': {'total': -1, 'next': -1, 'columns': [{'name': 'data.http.userAgent', 'displayName': 'data.http.userAgent', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'date', 'displayName': 'date', 'columnType': 'DIMENSION', 'dataType': 'DATE', 'sortable': true}, {'name': 'count', 'displayName': 'connections', 'columnType': 'MEASURE', 'dataType': 'NUMBER', 'sortable': true}], 'rows': [{'Jakarta Commons-HttpClient/3.1': {'2016-06-23T09:25:00.000': [0], '2016-06-23T10:00:00.000': [0], '2016-06-23T09:35:00.000': [0], '2016-06-23T10:10:00.000': [7], '2016-06-23T09:30:00.000': [0], '2016-06-23T10:05:00.000': [0], '2016-06-23T09:45:00.000': [0], '2016-06-23T09:40:00.000': [0], '2016-06-23T10:15:00.000': [0], '2016-06-23T09:20:00.000': [0], '2016-06-23T09:55:00.000': [0], '2016-06-23T09:15:00.000': [0], '2016-06-23T09:50:00.000': [0]}}]}},
      rawData = {'taf_top_longest_user_agents': {'total': -1, 'next': -1, 'columns': [{'name': 'data.http.userAgent', 'displayName': 'data.http.userAgent', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'date', 'displayName': 'date', 'columnType': 'DIMENSION', 'dataType': 'DATE', 'sortable': true}, {'name': 'count', 'displayName': 'connections', 'columnType': 'MEASURE', 'dataType': 'NUMBER', 'sortable': true}], 'rows': [{'Jakarta Commons-HttpClient/3.1': {'2016-06-23T09:25:00.000': [0], '2016-06-23T10:00:00.000': [0], '2016-06-23T09:35:00.000': [0], '2016-06-23T10:10:00.000': [7], '2016-06-23T09:30:00.000': [0], '2016-06-23T10:05:00.000': [0], '2016-06-23T09:45:00.000': [0], '2016-06-23T09:40:00.000': [0], '2016-06-23T10:15:00.000': [0], '2016-06-23T09:20:00.000': [0], '2016-06-23T09:55:00.000': [0], '2016-06-23T09:15:00.000': [0], '2016-06-23T09:50:00.000': [0]}}]}};
    expect(generateRawData(fieldMapping, apiData)).to.deep.equal(rawData);
  });

  it('getIndexFromColumnName should return index from column name.', function() {
    const columns = ['bandwidth'],
      columnArray = [{'name': 'source.ip', 'displayName': 'source.ip', 'columnType': 'DIMENSION',
        'dataType': 'TEXT', 'sortable': true},
        {'name': 'bandwidth', 'displayName': 'bandwidth', 'columnType': 'FORMULA',
          'dataType': 'NUMBER', 'sortable': true}],
      index = 1;
    expect(getIndexFromColumnName(columns, columnArray)).to.deep.equal(index);
  });

  it('getColumnIndexArrayFromColumnName should return index array from column name.', function() {
    const columns = ['country_name', 'connections'],
      columnArray = [{'name': 'destination.country', 'displayName': 'destination.country', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'pos_x', 'displayName': 'pos_x', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'pos_y', 'displayName': 'pos_y', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'country_name', 'displayName': 'country_name', 'columnType': 'DIMENSION', 'dataType': 'TEXT', 'sortable': true}, {'name': 'connections', 'displayName': 'connections', 'columnType': 'MEASURE', 'dataType': 'NUMBER', 'sortable': true}, {'name': 'bandwidth', 'displayName': 'bandwidth', 'columnType': 'FORMULA', 'dataType': 'NUMBER', 'sortable': true}],
      indexArray = [3, 4];
    expect(getColumnIndexArrayFromColumnName(columns, columnArray)).to.deep.equal(indexArray);
  });

  it('getXYIndexFromColumnNames should return x and y index from column name.', function() {
    const columns = ['data.http.__info.userAgentLen', 'date'],
      columnArray = [{'name': 'data.http.__info.userAgentLen', 'displayName': 'data.http.__info.userAgentLen', 'columnType': 'DIMENSION', 'dataType': 'NUMBER', 'sortable': true}, {'name': 'date', 'displayName': 'date', 'columnType': 'MEASURE', 'dataType': 'NUMBER', 'sortable': true}],
      indexArray = [0, 1];
    expect(getXYIndexFromColumnNames(columns, columnArray)).to.deep.equal(indexArray);
  });

  it('getIndexFromObjectName should return value from column name.', function() {
    const data1 = {
        'fieldName': 'data.rank_alert.name',
        'dataArray': {
          'data': {
            'rank_alert': {
              'name': 'anomaly',
              'services': [
                'UPS'
              ]
            }
          }
        }
      },
      data2 = {
        'fieldName': 'data.rank_alert.services[0]',
        'dataArray': {
          'data': {
            'rank_alert': {
              'name': 'anomaly',
              'services': [
                'UPS'
              ]
            }
          }
        }
      },
      data3 = {
        'fieldName': 'data.rank_alert.services[0]',
        'dataArray': {
          'data': {
            'rank_alert': {
              'name': 'anomaly',
              'services': []
            }
          }
        }
      },
      data4 = {
        'fieldName': 'data.rank_alert.name',
        'dataArray': {
          'data': {
            'rank_alert': {
              'services': []
            }
          }
        }
      },
      data5 = {
        'fieldName': 'data.rank_alert.services[0]',
        'dataArray': {
          'data': {
            'rank_alert': {
              'name': 'anomaly'
            }
          }
        }
      },
      value1 = 'anomaly',
      value2 = 'UPS';
    expect(getIndexFromObjectName(data1)).to.deep.equal(value1);
    expect(getIndexFromObjectName(data2)).to.deep.equal(value2);
    expect(getIndexFromObjectName(data3)).to.deep.equal('');
    expect(getIndexFromObjectName(data4)).to.deep.equal('');
    expect(getIndexFromObjectName(data5)).to.deep.equal('');
  });

  it('translateTimeWindow should return time window.', function() {
    expect(translateTimeWindow('1 hour')).to.deep.equal('1h');
  });

  it('isUndefined should return true if variable is defined.', function() {
    let index = 1;
    expect(isUndefined(index)).to.deep.equal(false);
  });

  it('getTimePairFromWindow should return from and to dates for the specific time window.', function() {
    const timePair = {'fromDate': '2016-07-21T17:00:00.000', 'toDate': '2016-07-21T18:00:00.000'};
    expect(getTimePairFromWindow('1d', '2016-07-21 17:00:00')).to.deep.equal(timePair);
  });

  it('getColorRanges should return from and to dates for the specific time window.', function() {
    const colorRanges = {'secure': [{'min': 1, 'max': 23, 'color': '#DBF8F7'}, {'min': 24, 'max': 45, 'color': '#BAF2F0'}, {'min': 46, 'max': 67, 'color': '#97ECE8'}, {'min': 68, 'max': 89, 'color': '#71E5DF'}, {'min': 90, 'max': 111, 'color': '#51DFD8'}, {'min': 112, 'max': 133, 'color': '#2BD8D0'}], 'malicious': [{'min': 1, 'max': 2, 'color': '#FEEDE8'}, {'min': 3, 'max': 3, 'color': '#FCDBD2'}, {'min': 4, 'max': 4, 'color': '#F8CABB'}, {'min': 5, 'max': 5, 'color': '#F9B6A2'}, {'min': 6, 'max': 6, 'color': '#F7A48B'}, {'min': 7, 'max': 7, 'color': '#F69275'}]};
    // expect(getColorRanges([126, 42, 35, 5, 2, 1, 1], [4])).to.deep.equal(colorRanges);
  });
});
