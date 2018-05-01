import React, {PropTypes} from 'react';
import ParentCard from 'containers/ParentCard';

const protocolChart = {
  header: {
    style: {
      paddingBottom: 0
    },
    title: {
      fontSize: '13px',
      fontWeight: 600,
      textTransform: 'capitalize'
    }
  },
  id: 'connections-by-protocol',
  type: 'charts/HorizontalBarChart',
  meta: {
    showHeader: true,
    showRefresh: false,
    showFullScreen: false,
    api: {
      path: '/api/analytics/reporting/execute/{reportId}',
      pathParams: {
        reportId: 'taf_asset_top_connections_by_protocol'
      },
      queryParams: {
        'type:pathParam': 'assetId:pathParam',
        window: ''
      }
    },
    title: 'Connections By Protocol'
  },
  attributes: {
    chartCaption: {
      display: 'none'
    },
    chartWidth: '100%',
    chartHeight: '200px',
    style: {
      width: '100%',
      padding: 0,
      boxShadow: 'none'
    },
    header: {
      style: {
        paddingBottom: 0
      },
      title: {
        fontSize: '13px',
        fontWeight: 600,
        textTransform: 'capitalize'
      }
    },
    id: 'connections-by-protocol-chart'
  },
  chartOptions: {
    showValues: '1',
    showLabels: '1',
    chartRightMargin: '0',
    divLineThickness: '2'
  },
  chart: {
    showAnnotations: false
  },
  chartData: {
    showTrendLines: false,
    fieldMapping: [
      {
        reportId: 'taf_connections_by_protocol',
        columns: [
          'protocol.service',
          'date'
        ]
      }
    ],
    multipleReportIds: false
  }
};

const userCharts = [
  {
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_successful_logins_by_user_on_machines_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Successful Logins by User'
    },
    chart: {
      height: '200',
      options: {
        paletteColors: '#03c5ed,#adecf9',
        xAxisName: 'Machines',
        divLineThickness: '2',
        showYAxisValues: '1',
        xAxisNameFontSize: '10',
        yAxisNameFontSize: '10',
        labelFontSize: '9',
        drawAnchors: '1',
        anchorRadius: '1',
        showlegend: '0',
        outCnvBaseFontSize: '9'
      },
      data: {
        fieldMapping: [
          {
            columns: [{
              columnType: 'DIMENSION'
            }],
            axis: 'x'
          },
          {
            seriesname: 'Current Logins',
            reportId: 'taf_asset_successful_logins_by_user_on_machines_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 0
            }],
            axis: 'y'
          },
          {
            seriesname: 'Historic Logins',
            reportId: 'taf_asset_successful_logins_by_user_on_machines_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 1
            }],
            axis: 'y'
          }
        ]
      }
    },
    attributes: {
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'success-login-count-chart'
    },
    id: 'success-login-count',
    type: 'charts/MultiSeriesColumn2d'
  },
  {
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_failed_logins_by_user_on_machines_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Failed Logins by User'
    },
    chart: {
      height: '200',
      options: {
        paletteColors: '#ef5976, #F69275',
        xAxisName: 'Machines',
        divLineThickness: '2',
        showYAxisValues: '1',
        xAxisNameFontSize: '10',
        yAxisNameFontSize: '10',
        labelFontSize: '9',
        drawAnchors: '1',
        anchorRadius: '1',
        showlegend: '0',
        outCnvBaseFontSize: '9'
      },
      data: {
        fieldMapping: [
          {
            columns: [{
              columnType: 'DIMENSION'
            }],
            axis: 'x'
          },
          {
            seriesname: 'Current Logins',
            reportId: 'taf_asset_failed_logins_by_user_on_machines_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 0
            }],
            axis: 'y'
          },
          {
            seriesname: 'Historic Logins',
            reportId: 'taf_asset_failed_logins_by_user_on_machines_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 1
            }],
            'axis': 'y'
          }
        ]
      }
    },
    attributes: {
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'failed-login-count-chart'
    },
    id: 'FailedLoginCount',
    type: 'charts/MultiSeriesColumn2d'
  },
  {
    chartOptions: {
      paletteColors: '#03c5ed,#adecf9',
      xAxisName: 'TIME',
      lineThickness: '1',
      drawAnchors: '0',
      divLineThickness: '2',
      showYAxisValues: '1',
      xAxisNameFontSize: '10',
      yAxisNameFontSize: '10',
      labelFontSize: '9',
      showlegend: '0',
      outCnvBaseFontSize: '9'
    },
    chartData: {
      fieldMapping: [
        {
          reportId: 'taf_asset_all_successful_logins_by_user_time_shifted',
          columns: [ 'date' ],
          axis: 'x'
        },
        {
          seriesname: 'Current Logins',
          reportId: 'taf_asset_all_successful_logins_by_user_time_shifted',
          columns: [ 'count[0]' ],
          renderas: 'Line',
          axis: 'y'
        },
        {
          seriesname: 'Historic Logins',
          reportId: 'taf_asset_all_successful_logins_by_user_time_shifted',
          columns: [ 'count[1]' ],
          renderas: 'Area',
          axis: 'y'
        }
      ],
      combinedResult: true
    },
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_all_successful_logins_by_user_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Successful logins by Time'
    },
    attributes: {
      chartHeight: '200',
      chartCaption: {
        display: 'none'
      },
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'successful-logins-by-user'
    },
    id: 'SuccessfulLoginsByUser',
    type: 'charts/MultiSeriesCombiChart'
  },
  {
    chartOptions: {
      paletteColors: '#ef5976, #F69275',
      xAxisName: 'TIME',
      lineThickness: '1',
      drawAnchors: '0',
      divLineThickness: '2',
      showYAxisValues: '1',
      xAxisNameFontSize: '10',
      yAxisNameFontSize: '10',
      labelFontSize: '9',
      showlegend: '0',
      outCnvBaseFontSize: '9'
    },
    chartData: {
      fieldMapping: [
        {
          reportId: 'taf_asset_all_failed_logins_by_user_time_shifted',
          columns: [ 'date' ],
          axis: 'x'
        },
        {
          seriesname: 'Current Logins',
          reportId: 'taf_asset_all_failed_logins_by_user_time_shifted',
          columns: [ 'count[0]' ],
          renderas: 'Line',
          axis: 'y'
        },
        {
          seriesname: 'Historic Logins',
          reportId: 'taf_asset_all_failed_logins_by_user_time_shifted',
          columns: [ 'count[1]' ],
          renderas: 'Area',
          axis: 'y'
        }
      ],
      combinedResult: true
    },
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_all_failed_logins_by_user_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Failed logins by Time'
    },
    attributes: {
      chartHeight: '200',
      chartCaption: {
        display: 'none'
      },
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'failed-logins-by-user'
    },
    id: 'FailedLoginsByUser',
    type: 'charts/MultiSeriesCombiChart'
  },
  protocolChart
];

const machineCharts = [
  {
    chart: {
      options: {
        paletteColors: '#03c5ed,#adecf9',
        xAxisName: 'Users',
        divLineThickness: '2',
        showYAxisValues: '1',
        xAxisNameFontSize: '10',
        yAxisNameFontSize: '10',
        labelFontSize: '9',
        drawAnchors: '1',
        anchorRadius: '1',
        showlegend: '0',
        outCnvBaseFontSize: '9'
      },
      data: {
        fieldMapping: [
          {
            columns: [{
              columnType: 'DIMENSION'
            }],
            axis: 'x'
          },
          {
            seriesname: 'Current Logins',
            reportId: 'taf_asset_successful_logins_on_machine_by_users_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 0
            }],
            axis: 'y'
          },
          {
            seriesname: 'Historic Logins',
            reportId: 'taf_asset_successful_logins_on_machine_by_users_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 1
            }],
            axis: 'y'
          }
        ]
      },
      height: '200'
    },
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_successful_logins_on_machine_by_users_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Successful Logins on Machine'
    },
    attributes: {
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'success-login-count-chart'
    },
    id: 'success-login-count',
    type: 'charts/MultiSeriesColumn2d'
  },
  {
    chart: {
      options: {
        paletteColors: '#ef5976, #F69275',
        xAxisName: 'Users',
        divLineThickness: '2',
        showYAxisValues: '1',
        xAxisNameFontSize: '10',
        yAxisNameFontSize: '10',
        labelFontSize: '9',
        drawAnchors: '1',
        anchorRadius: '1',
        showlegend: '0',
        outCnvBaseFontSize: '9'
      },
      data: {
        fieldMapping: [
          {
            columns: [{
              columnType: 'DIMENSION'
            }],
            axis: 'x'
          },
          {
            seriesname: 'Current Logins',
            reportId: 'taf_asset_failed_logins_on_machine_by_users_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 0
            }],
            axis: 'y'
          },
          {
            seriesname: 'Historic Logins',
            reportId: 'taf_asset_failed_logins_on_machine_by_users_time_shifted',
            columns: [{
              columnType: 'MEASURE',
              key: 1
            }],
            axis: 'y'
          }
        ]
      },
      height: '200'
    },
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_failed_logins_on_machine_by_users_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Failed Logins on Machine'
    },
    attributes: {
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'failed-login-count-chart'
    },
    id: 'FailedLoginCount',
    type: 'charts/MultiSeriesColumn2d'
  },
  {
    chartOptions: {
      paletteColors: '#03c5ed,#adecf9',
      xAxisName: 'TIME',
      lineThickness: '1',
      drawAnchors: '0',
      divLineThickness: '2',
      showYAxisValues: '1',
      xAxisNameFontSize: '10',
      yAxisNameFontSize: '10',
      labelFontSize: '9',
      showlegend: '0',
      outCnvBaseFontSize: '9'
    },
    chartData: {
      fieldMapping: [
        {
          reportId: 'taf_asset_all_successful_logins_by_machine_time_shifted',
          columns: [ 'date' ],
          axis: 'x'
        },
        {
          seriesname: 'Current Logins',
          reportId: 'taf_asset_all_successful_logins_by_machine_time_shifted',
          columns: [ 'count[0]' ],
          renderas: 'Line',
          axis: 'y'
        },
        {
          seriesname: 'Historic Logins',
          reportId: 'taf_asset_all_successful_logins_by_machine_time_shifted',
          columns: [ 'count[1]' ],
          renderas: 'Area',
          axis: 'y'
        }
      ],
      combinedResult: true
    },
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_all_successful_logins_by_machine_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Successful logins by Time'
    },
    attributes: {
      chartHeight: '200',
      chartCaption: {
        display: 'none'
      },
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'successful-logins-by-user'
    },
    id: 'SuccessfulLoginsByUser',
    type: 'charts/MultiSeriesCombiChart'
  },
  {
    chartOptions: {
      paletteColors: '#ef5976, #F69275',
      xAxisName: 'TIME',
      lineThickness: '1',
      drawAnchors: '0',
      divLineThickness: '2',
      showYAxisValues: '1',
      xAxisNameFontSize: '10',
      yAxisNameFontSize: '10',
      labelFontSize: '9',
      showlegend: '0',
      outCnvBaseFontSize: '9'
    },
    chartData: {
      fieldMapping: [
        {
          reportId: 'taf_asset_all_failed_logins_by_machine_time_shifted',
          columns: [ 'date' ],
          axis: 'x'
        },
        {
          seriesname: 'Current Logins',
          reportId: 'taf_asset_all_failed_logins_by_machine_time_shifted',
          columns: [ 'count[0]' ],
          renderas: 'Line',
          axis: 'y'
        },
        {
          seriesname: 'Historic Logins',
          reportId: 'taf_asset_all_failed_logins_by_machine_time_shifted',
          columns: [ 'count[1]' ],
          renderas: 'Area',
          axis: 'y'
        }
      ],
      combinedResult: true
    },
    meta: {
      showHeader: true,
      showRefresh: false,
      showFullScreen: false,
      api: {
        path: '/api/analytics/reporting/execute/{reportId}',
        pathParams: {
          reportId: 'taf_asset_all_failed_logins_by_machine_time_shifted'
        },
        queryParams: {
          window: '',
          timeShift: '',
          asset: 'assetId:pathParam'
        }
      },
      title: 'Failed logins by Time'
    },
    attributes: {
      chartHeight: '200',
      chartCaption: {
        display: 'none'
      },
      style: {
        width: '100%',
        minHeight: '100px',
        padding: 0,
        boxShadow: 'none',
        marginBottom: '35px'
      },
      header: {
        style: {
          paddingBottom: 0
        },
        title: {
          fontSize: '13px',
          fontWeight: 600,
          textTransform: 'capitalize'
        }
      },
      id: 'failed-logins-by-user'
    },
    id: 'FailedLoginsByUser',
    type: 'charts/MultiSeriesCombiChart'
  },
  protocolChart
];

class AssetMultiChart extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired
  }

  getCharts(charts) {
    return charts.map((chart, index) => {
      const elm = React.createFactory(require('components/' + chart.type).default, null);
      const {props} = this;
      chart.location = props.location;
      chart.params = props.params;
      chart.history = props.history;
      chart.key = chart.id;

      const componentElm = elm({...chart}, []);
      const ParentCardElement = React.createElement(ParentCard, {...chart}, componentElm);
      return ParentCardElement;
    });
  }

  render() {
    const {props: {params}} = this;

    let charts = [];
    if (params.type === 'user') {
      charts = userCharts;
    }
    else {
      charts = machineCharts;
    }

    return (
      <div>
        {this.getCharts(charts)}
      </div>
    );
  }
}

AssetMultiChart.contextTypes = {
  store: React.PropTypes.object
};

export default AssetMultiChart;
