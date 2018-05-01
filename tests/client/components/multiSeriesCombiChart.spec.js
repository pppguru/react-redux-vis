import React from 'react';
import TestUtils from 'react-addons-test-utils';
import MultiSeriesCombiChart, {
  getXindex,
  getYindex,
  generateCategoryArray,
  generateDataAndSeriesArrayForDynamicSeriesNames,
  generateChartDataSetForDynamicSeries,
  generateChartDataSetForFixedSeries,
  generateDataArray
} from 'components/charts/MultiSeriesCombiChart';

function shallowRender(component) {
  const renderer = TestUtils.createRenderer();

  renderer.render(component);
  return renderer.getRenderOutput();
}

function shallowRenderWithProps(props = {}) {
  return shallowRender(<MultiSeriesCombiChart {...props} />);
}

describe('<MultiSeriesCombiChart />', function() {
  it('Should render as null', function() {
    const props = {
      'attributes': {'id': 'AlertPriorityChart'},
      'meta': {
        'title': 'Anomaly Priority'
      },
      'data': null
    };

    const component = shallowRenderWithProps(props);
    expect(component).to.equal(null);
  });

  it('getXindex should return x index.', function() {
    const chartDataColumn = 'date',
      columns = [
        {
          'name': 'date',
          'displayName': 'date',
          'columnType': 'DIMENSION',
          'dataType': 'DATE',
          'sortable': true
        },
        {
          'name': 'data.rank_alert.score',
          'displayName': 'data.rank_alert.score',
          'columnType': 'DIMENSION',
          'dataType': 'TEXT',
          'sortable': true,
          'ranges': [
            {
              'alias': 'low',
              'min': 1,
              'max': 35
            },
            {
              'alias': 'medium',
              'min': 35,
              'max': 65
            },
            {
              'alias': 'high',
              'min': 65
            }
          ]
        },
        {
          'name': 'count',
          'displayName': 'count',
          'columnType': 'MEASURE',
          'dataType': 'NUMBER',
          'sortable': true
        }
      ],
      x = 0;
    expect(getXindex(chartDataColumn, columns)).to.deep.equal(x);
  });

  it('getYindex should return y index.', function() {
    const chartData = {
        'reportId': 'taf_alert_priority_time',
        'columns': [
          'data.rank_alert.score',
          'count'
        ],
        'seriesOptions': {
          'drawanchors': '1',
          'lineThickness': '0',
          'anchorradius': '5',
          'renderas': 'Line',
          'anchorbgcolor': [
            '#90d0a4',
            '#fcc875',
            '#f69275'
          ],
          'anchorBorderColor': [
            '#90d0a4',
            '#fcc875',
            '#f69275'
          ],
          'anchorsides': [
            '0',
            '0',
            '0'
          ]
        },
        'axis': 'y'
      },
      columns = [
        {
          'name': 'date',
          'displayName': 'date',
          'columnType': 'DIMENSION',
          'dataType': 'DATE',
          'sortable': true
        },
        {
          'name': 'data.rank_alert.score',
          'displayName': 'data.rank_alert.score',
          'columnType': 'DIMENSION',
          'dataType': 'TEXT',
          'sortable': true,
          'ranges': [
            {
              'alias': 'low',
              'min': 1,
              'max': 35
            },
            {
              'alias': 'medium',
              'min': 35,
              'max': 65
            },
            {
              'alias': 'high',
              'min': 65
            }
          ]
        },
        {
          'name': 'count',
          'displayName': 'count',
          'columnType': 'MEASURE',
          'dataType': 'NUMBER',
          'sortable': true
        }
      ],
      combinedResult = false,
      y = {'y': 2, 'y2': '', 'seriesIndex': 1};
    expect(getYindex(chartData, columns, combinedResult)).to.deep.equal(y);
  });

  it('generateCategoryArray should return category array.', function() {
    const rows = [
        [ '2016-07-20T06:50:00.000', 'low', 0 ],
        [ '2016-07-20T06:50:00.000', 'medium', 0 ],
        [ '2016-07-20T06:50:00.000', 'high', 0 ]
      ],
      index = 0,
      dateDisplayFormat = 'HH:mm',
      category = [{ 'label': '12:20', 'toolText': '20 Jul 2016 12:20:00.000' }];

    expect(generateCategoryArray(rows, index, dateDisplayFormat)).to.deep.equal(category);
  });

  it('generateDataAndSeriesArrayForDynamicSeriesNames should return data and series array for dynamic series names.',
    function() {
      const rows = [
        [
          '2016-07-20T07: 00: 00.000',
          'low',
          0
        ],
        [
          '2016-07-20T07: 00: 00.000',
          'medium',
          0
        ],
        [
          '2016-07-20T07: 00: 00.000',
          'high',
          0
        ]],
        x = 0,
        y = 2,
        seriesIndex = 1,
        resultArray = {
          'newRawData': [],
          'seriesNameArray': [
            {'seriesname': 'low'},
            {'seriesname': 'medium'},
            {'seriesname': 'high'}
          ]
        };
      expect(generateDataAndSeriesArrayForDynamicSeriesNames(rows, x, y, seriesIndex)).to.deep.equal(resultArray);
    }
  );

  it('generateChartDataSetForDynamicSeries should return chart data source for dynamic series.', function() {
    const chartData = {
        'reportId': 'taf_alert_priority_time',
        'columns': [
          'data.rank_alert.score',
          'count'
        ],
        'seriesOptions': {
          'drawanchors': '1',
          'lineThickness': '0',
          'anchorradius': '5',
          'renderas': 'Line',
          'anchorbgcolor': [
            '#90d0a4',
            '#fcc875',
            '#f69275'
          ],
          'anchorBorderColor': [
            '#90d0a4',
            '#fcc875',
            '#f69275'
          ],
          'anchorsides': [
            '0',
            '0',
            '0'
          ]
        },
        'axis': 'y'
      },
      seriesNameArray = [
        {
          'seriesname': 'low'
        },
        {
          'seriesname': 'medium'
        },
        {
          'seriesname': 'high'
        }
      ],
      newRawData = [
        [
          '2016-07-20T07: 05: 00.000',
          [
            0,
            0,
            0
          ]
        ],
        [
          '2016-07-20T07: 10: 00.000',
          [
            0,
            0,
            0
          ]
        ]
      ],
      dataset = [
        {
          'seriesname': 'low',
          'data': [
            {},
            {}
          ],
          'drawanchors': '1',
          'lineThickness': '0',
          'anchorradius': '5',
          'renderas': 'Line',
          'anchorbgcolor': '#90d0a4',
          'anchorBorderColor': '#90d0a4',
          'anchorsides': '0'
        },
        {
          'seriesname': 'medium',
          'data': [
            {},
            {}
          ],
          'drawanchors': '1',
          'lineThickness': '0',
          'anchorradius': '5',
          'renderas': 'Line',
          'anchorbgcolor': '#fcc875',
          'anchorBorderColor': '#fcc875',
          'anchorsides': '0'
        },
        {
          'seriesname': 'high',
          'data': [
            {},
            {}
          ],
          'drawanchors': '1',
          'lineThickness': '0',
          'anchorradius': '5',
          'renderas': 'Line',
          'anchorbgcolor': '#f69275',
          'anchorBorderColor': '#f69275',
          'anchorsides': '0'
        }
      ];
    expect(generateChartDataSetForDynamicSeries(chartData, seriesNameArray, newRawData)).to.deep.equal(dataset);
  });

  it('generateChartDataSetForFixedSeries should return chart data set for fixed series.', function() {
    const dataset = [
      {
        'seriesname': 'Historical Incoming Bandwidth',
        'renderas': 'Area',
        'data': [
          {
            'value': 0
          }
        ]
      }],
      chartData = {
        'axis': 'y',
        'seriesname': 'Current Incoming Bandwidth',
        'renderas': 'Line',
        'reportId': 'taf_stats_histogram',
        'columns': [
          'bytes_in[0]'
        ]
      },
      rows = [
        [
          '2016-07-22T10: 00: 00.000',
          [
            'NaN',
            'NaN'
          ],
          [
            'NaN',
            'NaN'
          ],
          [
            'NaN',
            'NaN'
          ],
          [
            'NaN',
            'NaN'
          ]
        ]
      ],
      y = 2,
      y2 = '0',
      resultDataset = [
        {
          'seriesname': 'Historical Incoming Bandwidth',
          'renderas': 'Area',
          'data': [
            {
              'value': 0
            }
          ]
        },
        {
          'seriesname': 'Current Incoming Bandwidth',
          'renderas': 'Line',
          'data': [
            {
              'value': 0
            }
          ]
        }
      ];
    expect(generateChartDataSetForFixedSeries(dataset, chartData, rows, y, y2)).to.deep.equal(resultDataset);
  });

  it('generateDataArray should return data array.', function() {
    const tempObj = {'seriesname': 'Current Incoming Bandwidth', 'renderas': 'Line', 'data': []},
      y = 2,
      rows = [
        [
          '2016-07-21T12: 00: 00.000',
          [
            14433,
            9927.432913397099
          ],
          [
            1580367491,
            1616463783.9151192
          ],
          [
            1577870664,
            1455285744.9127922
          ],
          [
            3158238155,
            3071748192.4738755
          ]
        ]
      ],
      y2 = 0,
      tempObjData = [
        {
          'value': 1580367491
        }
      ];
    expect(generateDataArray(tempObj, y, rows, y2, 'fixed')).to.deep.equal(tempObjData);
  });
});
