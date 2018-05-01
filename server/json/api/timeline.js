import {REPORTING_API_BASE_PATH} from '../../Constants';

export const timelineApi = [
  {
    path: '/alert/traffic',
    reportId: ''
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_alert_by_asset'
  },
  {
    path: '/anomaly/:anomalyId/events',
    reportId: ''
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_asset_session_details'
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_asset_session_event_details'
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_events_between_source_and_dest_same_type_as_edge'
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_events_with_protocol'
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_events_with_country'
  },
  {
    path: REPORTING_API_BASE_PATH,
    reportId: 'taf_events_between_source_and_dest'
  },
  {
    path: '/anomaly/:alertId/timeline',
    reportId: ''
  }
];
