import {
  msToTime,
  getEventTypeString,
  formatBytes,
  formatDateInLocalTimeZone
} from '../../commons/utils/utils';

import { getSingleChartData } from '../components/anomalyChart';

function getValue(value) {
  return value || '';
}

function getIPDetails(source) {
  if (source) {
    const info = {};
    if (source.ip) { info.ip = source.ip; }
    if (source.country) { info.country = source.country.toLowerCase(); }
    if (source.port) { info.port = source.port; }
    return info;
  }
  return null;
}

function getSourceDestination(row) {
  const {source, destination} = row;
  return {
    source: getIPDetails(source),
    dest: getIPDetails(destination)
  };
}

function getConn(row) {
  const {data: {conn}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Service: {
          displayKey: true,
          value: getValue(conn.service)
        },
        State: {
          displayKey: true,
          value: getValue(conn.state)
        },
        'Requested Bytes': {
          displayKey: true,
          value: getValue(conn.reqBytes) !== '' ? formatBytes(conn.reqBytes, 2) : ''
        },
        'Response Bytes': {
          displayKey: true,
          value: getValue(conn.respBytes) !== '' ? formatBytes(conn.respBytes, 2) : ''
        },
        Duration: {
          displayKey: true,
          value: getValue(conn.duration) !== '' ? msToTime(conn.duration).timeString : ''
        }
      }
    };

  return info;
}

function getSSH(row) {
  const {data: {ssh}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Direction: {
          displayKey: true,
          value: getValue(ssh.direction)
        },
        Client: {
          displayKey: true,
          value: getValue(ssh.client)
        },
        Server: {
          displayKey: true,
          value: getValue(ssh.server)
        },
        Successful: {
          displayKey: true,
          value: ssh.success ? 'Successful' : 'Failed'
        }
      }
    };

  return info;
}

function getDNS(row) {
  const {data: {dns}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        'DNS Response': {
          displayKey: true,
          value: getValue(dns.answers[0])
        }
      }
    };

  return info;
}

function getHTTP(row) {
  const {data: {http}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        'User Agent': {
          displayKey: true,
          value: getValue(http.userAgent)
        },
        Referrer: {
          displayKey: true,
          value: getValue(http.referrer)
        },
        Host: {
          displayKey: true,
          value: getValue(http.host)
        }
      }
    };

  return info;
}

function getSSL(row) {
  const {data: {ssl}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Server: {
          displayKey: true,
          value: getValue(ssl.serverName)
        },
        'SSL Version': {
          displayKey: true,
          value: getValue(ssl.version)
        },
        Issuer: {
          displayKey: true,
          value: getValue(ssl.issue)
        }
      }
    };

  return info;
}

function getFile(row) {
  const {data: {files}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        'File Name': {
          displayKey: true,
          value: getValue(files.filename)
        },
        'Mime Type': {
          displayKey: true,
          value: getValue(files.mimeType)
        },
        'File Hash': {
          displayKey: true,
          value: getValue(files.sha256)
        }
      }
    };

  return info;
}

function getReport(row) {
  const {data: {report}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        'File Name': {
          displayKey: true,
          value: getValue(report.file.fileName)
        },
        'sha256': {
          displayKey: true,
          value: getValue(report.file.sha256)
        },
        'Status': {
          displayKey: true,
          value: getValue(report.status)
        },
        'Score': {
          displayKey: true,
          value: getValue(report.score) !== '' ? (report.score).toString() : ''
        },
        'Mime Type': {
          displayKey: true,
          value: getValue(report.file.mimeType)
        }
      }
    };

  return info;
}

function getAlert(row) {
  const {data: {alert}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Severity: {
          displayKey: true,
          value: getValue(alert.severity)
        },
        Signature: {
          displayKey: true,
          value: getValue(alert.signature)
        },
        Category: {
          displayKey: true,
          value: getValue(alert.category)
        },
        Score: {
          displayKey: true,
          value: getValue(alert.score) !== '' ? (alert.score).toString() : ''
        }
      }
    };

  return info;
}

function getRankAlert(row) {
  const {data: {rank_alert}} = row,
    info = {
      id: getValue(row.id),
      Type: getEventTypeString(row.type),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Description: {
          displayKey: true,
          value: getValue(rank_alert.description)
        },
        Message: {
          displayKey: true,
          value: getValue(rank_alert.message)
        },
        Category: {
          displayKey: true,
          value: getValue(rank_alert.category)
        },
        Score: {
          displayKey: true,
          value: getValue(rank_alert.score) !== '' ? (rank_alert.score).toString() : ''
        }
      }
    };

  return info;
}

function getWinEvent(row) {
  const {data: {winevent}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        Message: {
          displayKey: true,
          value: getValue(winevent.Message)
        },
        Type: {
          displayKey: true,
          value: getValue(winevent.EventType)
        },
        Category: {
          displayKey: true,
          value: getValue(winevent.Category)
        },
        Source: {
          displayKey: true,
          value: getValue(winevent.SourceName)
        },
        Severity: {
          displayKey: true,
          value: getValue(winevent.Severity)
        },
        'Severity Value': {
          displayKey: true,
          value: getValue(winevent.SeverityValue)
        }
      }
    };

  return info;
}

function getAnomaly(row) {
  const {data: {anomaly}} = row,
    info = {
      id: getValue(row.id),
      Type: getEventTypeString(row.type),
      Date: getValue(row.date),
      chart: anomaly.context ? getSingleChartData(anomaly.context) : {},
      isIconDisplay: true,
      icon: {
        type: 'anomaly',
        name: getValue(anomaly.impact)
      },
      display: {
        Impact: {
          displayKey: false,
          value: getValue(anomaly.impact)
        },
        'Anomaly Description': {
          displayKey: false,
          value: getValue(anomaly.anomaly_description)
        }
      }
    };

  return info;
}

function getRDP(row) {
  const info = {
    id: getValue(row.id),
    Date: getValue(row.date),
    display: {
      sourceDest: getSourceDestination(row),
      Type: {
        displayKey: true,
        value: getEventTypeString(row.type)
      }
    }
  };

  return info;
}

function getAuth(row) {
  const {data: {auth}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        Message: {
          displayKey: true,
          value: getValue(auth.message)
        },
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Severity: {
          displayKey: true,
          value: auth.severity && auth.severity_label ? auth.severity_label + ' (' + auth.severity + ')' : ''
        },
        Status: {
          displayKey: true,
          value: getValue(auth.status)
        },
        Priority: {
          displayKey: true,
          value: getValue(auth.priority) !== '' ? (auth.priority).toString() : ''
        }
      }
    };

  return info;
}

function getInOutSessionSummary(type, row) {
  let info = {},
    data = row.session[type];
  type = type === 'internal' ? 'Internal' : 'External';
  if (data) {
    info[type] = {
      IncomingBandwidth: getValue(data.incomingBandwidth) !== '' ? formatBytes(data.incomingBandwidth, 2) : '0 Bytes',
      OutgoingBandwidth: getValue(data.outgoingBandwidth) !== '' ? formatBytes(data.outgoingBandwidth, 2) : '0 Bytes',
      Machines: data.machines ? data.machines.length : '0',
      Connections: getValue(data.connections) !== '' ? data.connections : '0'
    };
  }
  return info;
}

function getSession(row, info, url) {
  let startDate = row.from ? formatDateInLocalTimeZone(row.from) : '',
    endDate = row.to ? formatDateInLocalTimeZone(row.to) : '',
    assetType = url.includes('=user') ? 'user' : url.includes('=machine') ? 'machine' : '',
    specificDetails = {};

  info = Object.assign({}, info, {
    Date: getValue(row.from),
    endDate: getValue(row.to)
  });

  if (assetType === 'user') {
    specificDetails = Object.assign({}, specificDetails, {
      Machine: {
        displayKey: true,
        value: getValue(row.machine)
      }
    });
    info = Object.assign({}, info, {
      User: getValue(row.user),
      isIconDisplay: true,
      icon: {
        type: 'machine',
        name: 'desktop_mac'
      }
    });
  }

  if (assetType === 'machine') {
    specificDetails = Object.assign({}, specificDetails, {
      User: {
        displayKey: true,
        value: getValue(row.user)
      }
    });
    let userInitial = getValue(row.user);
    if (userInitial !== '') {
      userInitial = userInitial.charAt(0);
    }
    info = Object.assign({}, info, {
      Machine: getValue(row.machine),
      isIconDisplay: true,
      icon: {
        type: 'user',
        name: userInitial.toUpperCase()
      }
    });
  }

  info.display = Object.assign({}, info.display, specificDetails, {
    'Start Date': {
      displayKey: true,
      value: startDate !== '' ? startDate.date + ' ' + startDate.time : ''
    },
    'End Date': {
      displayKey: true,
      value: endDate !== '' ? endDate.date + ' ' + endDate.time : ''
    }
  });

  let inSummary = getInOutSessionSummary('internal', row),
    outSummary = getInOutSessionSummary('external', row);

  info.display = Object.assign({}, info.display, {
    summary: Object.assign({}, inSummary, outSummary)
  });

  return info;
}

function getDhcp(row) {
  const {data: {dhcp}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      sourceDest: getSourceDestination(row),
      display: {
        Message: {
          displayKey: true,
          value: getValue(dhcp.message)
        },
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Severity: {
          displayKey: true,
          value: dhcp.severity && dhcp.severity_label ? dhcp.severity_label + ' (' + dhcp.severity + ')' : ''
        },
        Priority: {
          displayKey: true,
          value: getValue(dhcp.priority) !== '' ? (dhcp.priority).toString() : ''
        },
        Facility: {
          displayKey: true,
          value: getValue(dhcp.facility) !== '' ? (dhcp.facility).toString() : ''
        },
        Machine: {
          displayKey: true,
          value: dhcp.machine ? dhcp.machine : ''
        }
      }
    };

  return info;
}

function getOther(row, url) {
  let info = {
    id: getValue(row.id),
    Type: getEventTypeString(row.type),
    Date: getValue(row.date),
    json: row,
    display: {}
  };

  if (row.session) {
    info.Type = 'Session';
    info = getSession(row, info, url);
  }

  return info;
}

function getDyConn(row) {
  const {data: {dyconn}} = row,
    info = {
      id: getValue(row.id),
      Date: getValue(row.date),
      display: {
        sourceDest: getSourceDestination(row),
        Type: {
          displayKey: true,
          value: getEventTypeString(row.type)
        },
        Service: {
          displayKey: true,
          value: getValue(dyconn.service)
        },
        State: {
          displayKey: true,
          value: getValue(dyconn.state)
        },
        'Requested Bytes': {
          displayKey: true,
          value: getValue(dyconn.reqBytes) !== '' ? formatBytes(dyconn.reqBytes, 2) : ''
        },
        'Response Bytes': {
          displayKey: true,
          value: getValue(dyconn.respBytes) !== '' ? formatBytes(dyconn.respBytes, 2) : ''
        },
        Duration: {
          displayKey: true,
          value: getValue(dyconn.duration) !== '' ? msToTime(dyconn.duration).timeString : ''
        }
      }
    };

  return info;
}

function getResourceAccess(row) {
  let info = {
    Date: getValue(row.date),
    display: {
      sourceDest: getSourceDestination(row),
      Type: {
        displayKey: true,
        value: getEventTypeString(row.type)
      },
      User: {
        displayKey: true,
        value: getValue(row.source.assets[0].info.displayName)
      },
      Resource: {
        displayKey: true,
        value: getValue(row.data['resource-access'].resources[0].info.displayName)
      },
      Operation: {
        displayKey: true,
        value: getValue(row.data['resource-access'].operation)
      }
    }
  };

  return info;
}

function getDetails(row, url) {
  switch (row.type.toLowerCase()) {
    case 'conn':
      return getConn(row);
    case 'ssh':
      return getSSH(row);
    case 'dns':
      return getDNS(row);
    case 'http':
      return getHTTP(row);
    case 'ssl':
      return getSSL(row);
    case 'file':
      return getFile(row);
    case 'files':
      return getFile(row);
    case 'report':
      return getReport(row);
    case 'alert':
      return getAlert(row);
    case 'rank_alert':
      return getRankAlert(row);
    case 'winevent':
      return getWinEvent(row);
    case 'anomaly':
      return getAnomaly(row);
    case 'rdp':
      return getRDP(row);
    case 'auth':
      return getAuth(row);
    case 'dhcp':
      return getDhcp(row);
    case 'dyconn':
      return getDyConn(row);
    case 'resource-access':
      return getResourceAccess(row);
    default:
      return getOther(row, url);
  }
}

export default async function Timeline(ctx, next) {
  let parsedData = await ctx.tempData;

  if (!parsedData.errorCode) {
    const normalizeData = parsedData.rows.map((row) => (getDetails(row[0], ctx.request.url)));
    parsedData.normalizeData = normalizeData;
    ctx.normalizeData = parsedData;
  }
};
