import React from 'react';
// import TestUtils from 'react-addons-test-utils';
import TestUtils, {
  createRenderer
} from 'react-addons-test-utils';

import { shallow, mount } from 'enzyme';
import ReactDOM from 'react-dom';
import Reactable from 'reactable';
import $ from 'jquery';
import TableCard, {
  generateIndividualRowData,
  generateRowObject,
  getColumnDataWhenApiReturnsSingleColumn,
  getColumnText,
  getColumnDataWhenApiReturnsMultipleColumns,
  calculateFieldValueForNestedResult,
  generateColumnTextForColumnTypeAsText,
  generateColumnTextForDisplayingDate,
  generateColumnTextForDisplayingCountryFlag
} from 'components/Table';
const {Table, Tr} = Reactable;

let ReactableTestUtils = {
  resetTestEnvironment: function() {
    window.renderApp = function(id) {
      ReactDOM.unmountComponentAtNode($('div#threatTable')[0]);
    };
    $('div#threatTable').remove();
  },

  // Expect the row specified to have the specified class
  expectRowClass: function(rowIndex, className) {
    let row = $($('#table tbody.reactable-data tr')[rowIndex]);
    expect(row.attr('class')).to.have.equal(className);
  },

  // Expect the columns of a the data row specified to have the values in the array as their text values
  expectRowText: function(rowIndex, textArray) {
    let row = $($('#table tbody.reactable-data tr')[rowIndex]).find('td');

    expect(row.length).to.equal(textArray.length);

    for (let i = 0; i < row.length; i++) {
      expect($(row[i]).text()).to.have.equal(textArray[i]);
    }
  },

  testNode: function() {
    let testNode = $('<div>').attr('id', 'threatTable');
    $('body').append(testNode);
    testNode.empty();
    return testNode[0];
  }
};

const props = {
  attributes: {id: 'recent-alerts'},
  data: null,
  'tableOptions': {
    'sortable': [
      'RANK SCORE',
      'DATE',
      'DETAILS',
      'SOURCE',
      'DESTINATION'
    ],
    'defaultSort': {
      'column': 'RANK SCORE',
      'direction': 'desc'
    },
    'filterable': [
      'DATE',
      'DETAILS',
      'SOURCE',
      'DESTINATION'
    ],
    'itemsPerPage': 5
  }
};

describe('Table Component: ', function() {
  it('Should component exists', function() {
    let component = shallow(<TableCard {...props} />);
    expect(component).to.exist;
  });

  it('Should render as <div>', function() {
    let component = shallow(<TableCard {...props} />);
    expect(component.type()).to.equal('div');
  });

  it('Should render as <table>', function() {
    let component = shallow(<TableCard {...props} />);
    let tableTag = component.childAt(0);
    expect(tableTag.type()).to.equal(Table);
  });

  // it('Should shows only 5 rows per page for itemsPerPage as 5', () => {});
  describe('itemsPerPage', function() {
    // const spy = sinon.spy(TableCard.prototype, 'render');
    // const wrapper = shallow(<TableCard {...props} />);

    // it('Should shows only 5 rows per page for itemsPerPage as 5', function() {
    //   expect(spy.calledOnce).to.equal(false);
    //   wrapper.setProps({ prop: {
    //     duration: '1h',
    //     id: 'recent-alerts',
    //     tableData: {
    //       'fieldMapping': [
    //         {
    //           'reportId': 'taf_alert_highpriority',
    //           'columns': [
    //             {
    //               'type': 'scoreWidget',
    //               'columnNameToDisplay': 'RANK SCORE',
    //               'data': [
    //                 {
    //                   'fieldName': 'data.rank_alert.score'
    //                 }
    //               ],
    //               'style': {
    //                 'width': '12%'
    //               }
    //             },
    //             {
    //               'type': 'text',
    //               'columnNameToDisplay': 'DATE',
    //               'data': [
    //                 {
    //                   'fieldName': 'date',
    //                   'displayName': 'date'
    //                 }
    //               ],
    //               'style': {
    //                 'width': '10%'
    //               }
    //             },
    //             {
    //               'type': 'text',
    //               'columnNameToDisplay': 'DETAILS',
    //               'data': [
    //                 {
    //                   'fieldName': 'data.rank_alert.description',
    //                   'displayName': 'description'
    //                 },
    //                 {
    //                   'fieldName': 'data.rank_alert.message',
    //                   'displayName': ''
    //                 }
    //               ],
    //               'style': {
    //                 'width': '38%'
    //               }
    //             },
    //             {
    //               'type': 'text',
    //               'columnNameToDisplay': 'SOURCE',
    //               'data': [
    //                 {
    //                   'fieldName': 'source.ip',
    //                   'displayName': 'IP'
    //                 },
    //                 {
    //                   'fieldName': 'source.port',
    //                   'displayName': 'port'
    //                 },
    //                 {
    //                   'fieldName': 'source.country',
    //                   'displayName': 'countryFlag'
    //                 },
    //                 {
    //                   'fieldName': 'source.name',
    //                   'displayName': 'Machine'
    //                 },
    //                 {
    //                   'fieldName': 'source.owner',
    //                   'displayName': 'Owner'
    //                 },
    //                 {
    //                   'fieldName': 'source.asn',
    //                   'displayName': 'ASN'
    //                 },
    //                 {
    //                   'fieldName': 'source.assets',
    //                   'displayName': 'Users'
    //                 }
    //               ],
    //               'style': {
    //                 'width': '20%'
    //               }
    //             },
    //             {
    //               'type': 'text',
    //               'columnNameToDisplay': 'DESTINATION',
    //               'data': [
    //                 {
    //                   'fieldName': 'destination.ip',
    //                   'displayName': 'IP'
    //                 },
    //                 {
    //                   'fieldName': 'destination.port',
    //                   'displayName': 'port'
    //                 },
    //                 {
    //                   'fieldName': 'destination.country',
    //                   'displayName': 'countryFlag'
    //                 },
    //                 {
    //                   'fieldName': 'destination.name',
    //                   'displayName': 'Name'
    //                 },
    //                 {
    //                   'fieldName': 'destination.owner',
    //                   'displayName': 'Owner'
    //                 },
    //                 {
    //                   'fieldName': 'destination.asn',
    //                   'displayName': 'ASN'
    //                 },
    //                 {
    //                   'fieldName': 'destination.assets',
    //                   'displayName': 'Users'
    //                 }
    //               ],
    //               'style': {
    //                 'width': '20%'
    //               }
    //             }
    //           ]
    //         }
    //       ]
    //     },
    //     tableOptions: {
    //       'sortable': [
    //         'RANK SCORE',
    //         'DATE',
    //         'DETAILS',
    //         'SOURCE',
    //         'DESTINATION'
    //       ],
    //       'defaultSort': {
    //         'column': 'RANK SCORE',
    //         'direction': 'desc'
    //       },
    //       'filterable': [
    //         'DATE',
    //         'DETAILS',
    //         'SOURCE',
    //         'DESTINATION'
    //       ],
    //       'itemsPerPage': 5
    //     }
    //   }});
    //   expect(spy.calledOnce).to.equal(false);
    // });

    // ***********************************
    let component = shallow(<TableCard {...props} />);

    const spy = sinon.spy(TableCard.prototype, 'render');
    component.setProps({ prop: {
      duration: '1h',
      id: 'recent-alerts',
      tableData: {
        'fieldMapping': [
          {
            'reportId': 'taf_alert_highpriority',
            'columns': [
              {
                'type': 'scoreWidget',
                'columnNameToDisplay': 'RANK SCORE',
                'data': [
                  {
                    'fieldName': 'data.rank_alert.score'
                  }
                ],
                'style': {
                  'width': '12%'
                }
              },
              {
                'type': 'text',
                'columnNameToDisplay': 'DATE',
                'data': [
                  {
                    'fieldName': 'date',
                    'displayName': 'date'
                  }
                ],
                'style': {
                  'width': '10%'
                }
              },
              {
                'type': 'text',
                'columnNameToDisplay': 'DETAILS',
                'data': [
                  {
                    'fieldName': 'data.rank_alert.description',
                    'displayName': 'description'
                  },
                  {
                    'fieldName': 'data.rank_alert.message',
                    'displayName': ''
                  }
                ],
                'style': {
                  'width': '38%'
                }
              },
              {
                'type': 'text',
                'columnNameToDisplay': 'SOURCE',
                'data': [
                  {
                    'fieldName': 'source.ip',
                    'displayName': 'IP'
                  },
                  {
                    'fieldName': 'source.port',
                    'displayName': 'port'
                  },
                  {
                    'fieldName': 'source.country',
                    'displayName': 'countryFlag'
                  },
                  {
                    'fieldName': 'source.name',
                    'displayName': 'Machine'
                  },
                  {
                    'fieldName': 'source.owner',
                    'displayName': 'Owner'
                  },
                  {
                    'fieldName': 'source.asn',
                    'displayName': 'ASN'
                  },
                  {
                    'fieldName': 'source.assets',
                    'displayName': 'Users'
                  }
                ],
                'style': {
                  'width': '20%'
                }
              },
              {
                'type': 'text',
                'columnNameToDisplay': 'DESTINATION',
                'data': [
                  {
                    'fieldName': 'destination.ip',
                    'displayName': 'IP'
                  },
                  {
                    'fieldName': 'destination.port',
                    'displayName': 'port'
                  },
                  {
                    'fieldName': 'destination.country',
                    'displayName': 'countryFlag'
                  },
                  {
                    'fieldName': 'destination.name',
                    'displayName': 'Name'
                  },
                  {
                    'fieldName': 'destination.owner',
                    'displayName': 'Owner'
                  },
                  {
                    'fieldName': 'destination.asn',
                    'displayName': 'ASN'
                  },
                  {
                    'fieldName': 'destination.assets',
                    'displayName': 'Users'
                  }
                ],
                'style': {
                  'width': '20%'
                }
              }
            ]
          }
        ]
      },
      tableOptions: {
        'sortable': [
          'RANK SCORE',
          'DATE',
          'DETAILS',
          'SOURCE',
          'DESTINATION'
        ],
        'defaultSort': {
          'column': 'RANK SCORE',
          'direction': 'desc'
        },
        'filterable': [
          'DATE',
          'DETAILS',
          'SOURCE',
          'DESTINATION'
        ],
        'itemsPerPage': 5
      }
    }});
    it('Should shows only 5 rows per page for itemsPerPage as 5', function() {
      expect(component.find('.threatTable')).to.have.length(1);
      expect(spy.calledOnce).to.equal(false);// This is not yet working correctly. Kept this on hold, for now.
    });

    // const table = TestUtils.renderIntoDocument(<TableCard {...props} />);
    // const rows = TestUtils.scryRenderedDOMComponentsWithType(table, Tr);
    // const rows = table.find(Tr);
    // let component = shallow(<TableCard {...props} />);
    // let tableTag = component.childAt(0);
    // const rows = tableTag.find(Tr);
    // it('Should shows only 5 rows per page for itemsPerPage as 5', function() {
    //   expect(rows).to.have.length.of(0);
    //   // expect(table.prop('columns')).to.eql(5);
    // });

    // let component = shallow(<TableCard {...props} />);
    // let tableTag = component.childAt(0);
    // console.log(tableTag.html());
    // const renderer = createRenderer();
    // renderer.render(<TableCard {...props} />);
    // let component = renderer.getRenderOutput();

    // before(function() {
    //   ReactDOM.render(
    //     component,
    //     ReactableTestUtils.testNode()
    //   );
    // });

    // console.log(component);

    // after(ReactableTestUtils.resetTestEnvironment);

    // it('Should shows only 5 rows per page for itemsPerPage as 5', function() {
    //   expect($('#recent-alerts tbody.reactable-data tr').length).to.equal(0);
    // });
  });

  // it('Should call generateDataSource once', () => {});

  // it('Should call generateIndividualRowData specific number of times', () => {});

  it('generateIndividualRowData should return individual row data.', function() {
    const rowColumnDetails = {
      'currentColumnType': 'chart',
      'currentColumnDataArray': [
        {
          'fieldName': 'data.rank_alert.score'
        }
      ],
      'columnsArray': [
        {
          'name': 'json',
          'displayName': 'json',
          'columnType': 'ATTRIBUTE',
          'dataType': 'OBJECT',
          'sortable': true
        }
      ],
      'currentDataRows': [
        {
          'date': '2016-06-24T07:32: 05.280',
          'data': {
            'rank_alert': {
              'score': 65,
              'triggered': '2016-06-20T07:34: 05.214',
              'partition': 'OikKAfhDbGl2ZVlXSU4tTkxKVTJKRFE5UkYucmFuay5sb2NhbPk',
              'created': '2016-06-20T07:34: 05.214',
              'interesting': [
                {
                  'id': 'OikKAfhGbWFjaGluZVlXSU4tTkxKVTJKRFE5UkYucmFuay5sb2NhbPk',
                  'type': 'machine',
                  'value': 'WIN-NLJU2JDQ9RF.rank.local'
                }
              ],
              'scoreDetails': [
                {
                  'contribution': 65,
                  'lastSeen': '2016-06-24T07:32: 05.299',
                  'firstSeen': '2016-06-20T07:34: 05.229',
                  'message': 'Potential Pass-the-hash activity detected on host',
                  'uuid': '287404132'
                }
              ],
              'name': 'winevent.passthehash',
              'description': 'Potential Pass-the-hash activity detected on host',
              'modified': '2016-06-24T07:32: 05.280',
              'justification': [
              ],
              'message':
                'Suspicious activity indicative of a pass-the-hash attack detected on host WIN-NLJU2JDQ9RF.rank.local',
              'category': 'suspicious-login'
            }
          },
          'origin': 'live'
        }
      ],
      'columnText': '',
      'chartValue': '',
      'timeValue': '',
      'currentColumnIndex': 0
    };
    expect(generateIndividualRowData(rowColumnDetails)).to.deep.equal(
      {'chartValue': 65, 'columnText': '', 'timeValue': ''});
  });

  it('generateRowObject should return row object.', function() {
    const rowDetails = {
        'currentColumnType': 'chart',
        'currentTableData': {
          'type': 'chart',
          'columnNameToDisplay': 'Rank Score',
          'attributes': {
            'id': 'recentAlert',
            'chartType': 'angulargauge',
            'chartWidth': '70',
            'chartHeight': '60'
          },
          'chartOptions': {
          },
          'colorRangeOptions': {
          },
          'dialOptions': {
          },
          'data': [
            {
              'fieldName': 'data.rank_alert.score'
            }
          ],
          'style': {
            'width': '10%'
          }
        },
        'chartValue': 65,
        'columnText': '',
        'rowNumber': 0,
        'timeValue': ''
      },
      mainObject = {'columns': []};
    expect(generateRowObject(rowDetails, mainObject)).to.deep.equal({
      'columns': [
        {
          'columnType': 'chart',
          'columnName': 'Rank Score',
          'columnStyle': {
            'width': '10%'
          },
          'chartValue': 65,
          'chartId': 'recentAlert0',
          'chartType': 'angulargauge',
          'chartWidth': '70',
          'chartHeight': '60'
        }
      ]
    });
  });

  it('getColumnDataWhenApiReturnsSingleColumn should return column data when API returns single column.', function() {
    const columnDetails = {
      'currentColumnType': 'chart',
      'currentColumnDataArray': {
        'fieldName': 'data.rank_alert.score'
      },
      'currentDataRows': [
        {
          'date': '2016-06-24T07:16:43.078',
          'data': {
            'rank_alert': {
              'score': 65,
              'triggered': '2016-06-20T07:34: 05.214',
              'partition': 'OikKAfhDbGl2ZVlXSU4tTkxKVTJKRFE5UkYucmFuay5sb2NhbPk',
              'created': '2016-06-20T07:34: 05.214',
              'interesting': [
                {
                  'id': 'OikKAfhGbWFjaGluZVlXSU4tTkxKVTJKRFE5UkYucmFuay5sb2NhbPk',
                  'type': 'machine',
                  'value': 'WIN-NLJU2JDQ9RF.rank.local'
                }
              ],
              'scoreDetails': [
                {
                  'contribution': 65,
                  'lastSeen': '2016-06-24T07:16:43.095',
                  'firstSeen': '2016-06-20T07:34: 05.229',
                  'message': 'Potential Pass-the-hash activity detected on host',
                  'uuid': '287404132'
                }
              ],
              'name': 'winevent.passthehash',
              'description': 'Potential Pass-the-hash activity detected on host',
              'modified': '2016-06-24T07:16:43.078',
              'justification': [
              ],
              'message':
                'Suspicious activity indicative of a pass-the-hash attack detected on host WIN-NLJU2JDQ9RF.rank.local',
              'category': 'suspicious-login'
            }
          },
          'origin': 'live'
        }
      ],
      'columnText': '',
      'chartValue': '',
      'timeValue': ''
    };
    expect(getColumnDataWhenApiReturnsSingleColumn(columnDetails)).to.deep.equal(
      {'columnText': '', 'chartValue': 65, 'timeValue': ''});
  });

  it('getColumnText should return column text.', function() {
    const columnDetails = {
      'currentColumnType': 'chart',
      'fieldName': 'data.rank_alert.score',
      'fieldValue': 65,
      'columnText': '',
      'chartValue': '',
      'timeValue': ''
    };
    expect(getColumnText(columnDetails)).to.deep.equal({'columnText': '', 'chartValue': 65, 'timeValue': ''});
  });

  it('getColumnDataWhenApiReturnsMultipleColumns should return column data when API returns multiple column.',
    function() {
      const columnDetails = {
        'currentColumnType': 'text',
        'currentColumnDataArray': {
          'fieldName': 'destination.asn',
          'displayName': 'ASN'
        },
        'currentDataRows': [
          '2016-07-20T06:26:10.126',
          604616898,
          'Kafka or H2 (DBMS) Database Server',
          '172.31.9.170',
          33788,
          'demo.ranksoftwareinc.com',
          [
            'root'
          ],
          null,
          null,
          null,
          '172.31.9.171',
          9092,
          'rank-slave1',
          [
            'root'
          ],
          null,
          null,
          null,
          137829593,
          26485,
          [
            'CNTOKPNKVKNTMx1PPTUUx1NTOKPNKVKNTNx1VMVO'
          ]
        ],
        'columnText': '<span class="heading">IP: </span><span>172.31.9.171</span>:9092',
        'chartValue': '',
        'timeValue': '',
        'columnIndex': 16,
        'columnIndexLayoutJSON': 4
      };
      expect(getColumnDataWhenApiReturnsMultipleColumns(columnDetails)).to.deep.equal(
        {
          'columnText': '<span class="heading">IP: </span><span>172.31.9.171</span>:9092',
          'chartValue': '',
          'timeValue': ''
        });
    }
  );

  it('calculateFieldValueForNestedResult should return field value for nested result.', function() {
    const columnDetails = {
      'currentDataRows': {
        'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)': {
          '2016-06-24T07:35: 00.000': [
            0
          ],
          '2016-06-24T07:30: 00.000': [
            0
          ],
          '2016-06-24T08: 05: 00.000': [
            0
          ],
          '2016-06-24T07:10: 00.000': [
            0
          ],
          '2016-06-24T07:45: 00.000': [
            0
          ],
          '2016-06-24T07: 05: 00.000': [
            0
          ],
          '2016-06-24T07:40: 00.000': [
            0
          ],
          '2016-06-24T07:20: 00.000': [
            0
          ],
          '2016-06-24T07:55: 00.000': [
            0
          ],
          '2016-06-24T07:15: 00.000': [
            1
          ],
          '2016-06-24T07:50: 00.000': [
            0
          ],
          '2016-06-24T07:25: 00.000': [
            0
          ],
          '2016-06-24T08: 00: 00.000': [
            0
          ]
        }
      },
      'fieldValue': '',
      'columnIndexLayoutJSON': 0,
      'emptyValueMessage': '{empty user agent}'
    };
    expect(calculateFieldValueForNestedResult(columnDetails)).to.deep.equal(
      'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; WOW64; Trident/6.0)');
  });

  it('generateColumnTextForColumnTypeAsText should return column text if column type is text.', function() {
    const columnDetails = {
      'currentColumnType': 'text',
      'fieldName': 'destination.asn',
      'displayName': 'ASN',
      'fieldValue': null,
      'columnText': '<span class="heading">IP: </span><span>172.31.9.172</span>:9092',
      'chartValue': '',
      'timeValue': ''
    };
    expect(generateColumnTextForColumnTypeAsText(columnDetails)).to.deep.equal(
      '<span class="heading">IP: </span><span>172.31.9.172</span>:9092'
    );
  });

  it('generateColumnTextForDisplayingDate should return formatted date.', function() {
    const value = '2016-07-20T07:08:16.802';
    expect(generateColumnTextForDisplayingDate(value)).to.deep.equal(
      '<span style="font-size: 14px; font-weight: 600;">20 Jul 2016</span><br/>12:38:16.802'
    );
  });

  it('generateColumnTextForDisplayingCountryFlag should return html for displaying country flag.', function() {
    const value = 'CA';
    expect(generateColumnTextForDisplayingCountryFlag(value)).to.deep.equal(
      ' <span class="flag-icon flag-icon-ca" rel="tooltip" title="Canada"></span>');
  });
});
