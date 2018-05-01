import Timeline from '../../../server/components/Timeline';
import {getCtx} from '../../testUtils';

const columns = [
  {
    'name': 'json',
    'displayName': 'json',
    'columnType': 'ATTRIBUTE',
    'dataType': 'OBJECT',
    'sortable': true
  }
];

const source = {
    'ipHighBits': 0,
    'owner': 'Chinanet',
    'country': 'CN',
    'internal': false,
    'city': 'Nanjing',
    'ip': '221.229.172.66',
    'coordinates': {
      'lon': 118.77780151367188,
      'lat': 32.06170654296875
    },
    'reputation': [
      {
        'reputation': [
          'Scanning Host'
        ],
        'source': 'Alien Vault'
      }
    ],
    'port': 14854,
    'ipLowBits': 3722816578,
    'name': '221.229.172.66',
    'region': '04',
    'asn': 4134
  },
  destination = {
    'ipHighBits': 0,
    'port': 0,
    'ipLowBits': 2887714622,
    'ip': '172.31.7.62',
    'name': '172.31.7.62',
    'reputation': []
  };

const rankAlert = {
  'date': '2016-11-08T04:54:58.716',
  'data': {
    'rank_alert': {
      'description': 'Rank alert card desc',
      'message': 'Rank alert card message',
      'score': 65,
      'category': 'Rank alert card category'
    }
  },
  destination,
  'id': 'rankId',
  source,
  'type': 'rank_alert'
};

const alert = {
  'date': '2016-11-08T04:54:15.592',
  'data': {
    'alert': {
      'severity': 'LOW',
      'in_iface': 'eth0',
      'signature_id': 2019876,
      'rev': 4,
      'gid': 1,
      'signature': 'ET SCAN SSH BruteForce Tool with fake PUTTY version',
      'flow_id': 35739232,
      'proto': 'TCP',
      'action': 'allowed',
      'category': 'Detection of a Network Scan'
    }
  },
  'host': 'demo-sensor.aws.demo.ranksoftwareinc.com',
  destination,
  'id': 'alertId',
  source,
  'type': 'alert'
};

const ssh = {
  'date': '2016-11-08T04:54:15.228',
  'data': {
    'ssh': {
      'kex_alg': 'diffie-hellman-group-exchange-sha1',
      'server': 'SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.8',
      'mac_alg': 'hmac-md5',
      'host_key': '28:c6:cb:1c:33:26:46:bf:f0:9c:b4:32:86:fa:42:b2',
      'success': false,
      'cipher_alg': 'aes128-ctr',
      'client': 'SSH-2.0-PUTTY',
      'host_key_alg': 'ssh-rsa',
      'compression_alg': 'none',
      'version': '2',
      'direction': ''
    }
  },
  destination,
  'micros': 766,
  'id': 'sshId',
  source,
  'type': 'ssh'
};

const connAlert = {
  'date': '2016-11-08T04:54:43.472',
  'data': {
    'conn': {
      'reqBytes': 1123,
      'missedBytes': 0,
      'history': 'ShADadFf',
      'respPackets': 13,
      'respIPBytes': 3327,
      'respBytes': 2643,
      'localResponse': false,
      'duration': 28598941,
      'protocol': 'tcp',
      'localOrigin': false,
      'service': 'ssh',
      'reqIPBytes': 1963,
      'startTime': '2016-11-08T04:54:14.874',
      'state': 'SF',
      'reqPackets': 16,
      'tunnel': '',
      'status': 'success'
    }
  },
  destination,
  'id': 'connId',
  source,
  'type': 'conn'
};

const report = {
  'date': '2016-11-08T12:00:33.000',
  'data': {
    'report': {
      'date': '2016-11-08T12:00:33.000',
      'score': 80,
      'file': {
        'sha1': '5843992ecdccf7818fad46d4d1f6ca711e8f3a3d',
        'fileName': 'pafish.exe',
        'sha256': 'd309ca97de4f5a3aa203cdac46d8dc23ba1d1a47b24c24139b885ab5186b7eba',
        'mimeType': 'application/x-msdownload; format=pe32',
        'md5': 'b8d4d86a897e79ae3e219b18d1973da8'
      },
      'status': 'ANALYZED'
    }
  },
  'id': 'reportId',
  'type': 'report'
};

const files = {
  'date': '2016-11-08T12:00:32.580',
  'data': {
    'files': {
      'timedout': false,
      'txHosts': [ '52.20.162.90' ],
      'transferTime': 0,
      'sha256': 'd309ca97de4f5a3aa203cdac46d8dc23ba1d1a47b24c24139b885ab5186b7eba',
      'origin': false,
      'source': 'HTTP',
      'mimeType': 'application/x-dosexec',
      'extracted': 'filename="pafish.exe"',
      'local': false,
      'seen': 75776,
      'parentFileUid': '',
      'sha1': '5843992ecdccf7818fad46d4d1f6ca711e8f3a3d',
      'total': 75776,
      'rxHosts': [ '172.31.7.62' ],
      'depth': 0,
      'filename': 'pafish.exe',
      'overflow': 0,
      'analyzers': [ 'PE', 'SHA256', 'MD5', 'SHA1', 'EXTRACT' ],
      'missing': 0,
      'fuid': 'FV7nte2NDywBERuWni',
      'md5': 'b8d4d86a897e79ae3e219b18d1973da8'
    }
  },
  'host': 'demo-sensor.aws.demo.ranksoftwareinc.com',
  destination,
  'micros': 949,
  'id': 'filesId',
  source,
  'type': 'files'
};

const anomaly = {
  'date': '2016-10-13T00:00:00.000',
  'data': {
    'anomaly': {
      'score': 0.8734180038767266,
      'method': 'TimeSeriesRpca',
      'anomaly_description': 'Abnormal number of connections by host to given country',
      'impact': 'Data Exfiltration',
      'asset_type': 'IP',
      'analysis_description': 'Analysis of connection count by host for all countries',
      'source': 'country-connectivity-rpca',
      'asset': '192.168.2.28',
      'explanation': [
        'dstip',
        'protocol'
      ]
    }
  },
  'origin': 'ml',
  'id': 'anomalyId',
  'type': 'anomaly'
};

const http = {
  'date': '2016-11-08T12:00:10.028',
  'data': {
    'http': {
      'originalMimeTyes': [],
      'fileName': '',
      'method': 'GET',
      'responseLength': 10462,
      'userAgent': 'Media Center',
      'statusMessage': 'OK',
      'referrer': 'http://forpagesearch.eu/u2b871hi/RMtPEeENIz3RGmDA2Ruk',
      'password': '',
      'depth': 1,
      'host': 'forpagesearch.eu',
      'statusCode': 200,
      'infoMessage': '',
      'username': ''
    }
  },
  destination,
  'micros': 906,
  'id': 'httpId',
  source,
  'type': 'http'
};

function cardTests(ctx, props, cardType, assetType) {
  const {normalizeData: {normalizeData: result}} = ctx;
  expect(result).to.be.an('array');
  expect(result).to.have.lengthOf(1);

  const [card] = result;
  expect(card).to.be.an('object');
  for (let [key, value] of Object.entries(props)) {
    if (key === 'display') {
      if (value) {
        expect(value).to.be.an('object');
        for (let [displayKey, displayValue] of Object.entries(value)) {
          if (displayKey !== 'sourceDest') {
            expect(displayValue).to.be.an('object');
            expect(displayValue).to.have.property('displayKey');
            expect(displayValue).to.have.property('value');
          }
        }
      }
      else {
        expect(card).to.have.property(key);
      }
    }
    else {
      if (value) {
        expect(card).to.have.property(key, value);
      }
      else {
        expect(card).to.have.property(key);
      }
    }
  }
}

// DAL stands for Data Abstraction Layer.
describe('Timeline DAL', () => {
  it('exists', async function() {
    const result = await Timeline;
    expect(result).to.exist;
  });

  it('returns undefined if api returns error', async function() {
    const ctx = getCtx({errorCode: 404});
    await Timeline(ctx);
    const {normalizeData: result} = ctx;
    expect(result).to.be.undefined;
  });

  it('returns blank array of normalizeData if rows are blank', async function() {
    const ctx = getCtx({columns, rows: []});
    await Timeline(ctx);

    const {normalizeData: {normalizeData: result}} = ctx;
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(0);
  });

  it('returns conn card', async function() {
    const ctx = getCtx({columns, rows: [[connAlert]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'connId',
      'Date': null,
      'display': {
        'sourceDest': null,
        'Type': {
          displayKey: true,
          value: 'Connection'
        },
        'Service': {
          displayKey: true,
          value: 'ssh'
        },
        'State': {
          displayKey: true,
          value: 'SF'
        },
        'Requested Bytes': {
          displayKey: true,
          value: '1.12 KB'
        },
        'Response Bytes': {
          displayKey: true,
          value: '2.64 KB'
        },
        'Duration': {
          displayKey: true,
          value: '07 : 56 : 38'
        }
      }
    });
  });

  it('returns ssh card', async function() {
    const ctx = getCtx({columns, rows: [[ssh]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'sshId',
      'Date': null,
      'display': {
        'sourceDest': null,
        'Type': {
          displayKey: true,
          value: 'SSH'
        },
        'Client': {
          displayKey: true,
          value: 'SSH-2.0-PUTTY'
        },
        'Server': {
          displayKey: true,
          value: 'SSH-2.0-OpenSSH_6.6.1p1 Ubuntu-2ubuntu2.8'
        }
      }
    });
  });

  it('returns dns card', async function() {
    const dns = {
      id: 'dnsid',
      date: '2016-11-08T04:54:15.592',
      type: 'dns',
      source,
      destination,
      data: {dns: {answers: ['answer']}}
    };

    const ctx = getCtx({columns, rows: [[dns]]});
    await Timeline(ctx);

    cardTests(ctx, {
      id: 'dnsid',
      Date: null,
      display: {
        sourceDest: null,
        Type: {
          displayKey: true,
          value: 'DNS'
        },
        'DNS Response': {
          displayKey: true,
          value: 'answer'
        }
      }
    });
  });

  it('returns http card', async function() {
    const ctx = getCtx({columns, rows: [[http]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'httpId',
      'Date': null,
      'display': {
        'sourceDest': null,
        'Type': {
          displayKey: true,
          value: 'HTTP'
        },
        'User Agent': {
          displayKey: true,
          value: 'Media Center'
        },
        Referrer: {
          displayKey: true,
          value: 'http://forpagesearch.eu/u2b871hi/RMtPEeENIz3RGmDA2Ruk'
        }
      }
    });
  });

  it('returns file card', async function() {
    const ctx = getCtx({columns, rows: [[files]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'filesId',
      'Date': null,
      'display': {
        'sourceDest': null,
        'Type': {
          displayKey: true,
          value: 'File'
        },
        'File Name': {
          displayKey: true,
          value: 'pafish.exe'
        },
        'Mime Type': {
          displayKey: true,
          value: 'application/x-dosexec'
        },
        'File Hash': {
          displayKey: true,
          value: 'd309ca97de4f5a3aa203cdac46d8dc23ba1d1a47b24c24139b885ab5186b7eba'
        }
      }
    });
  });

  it('returns report card', async function() {
    const ctx = getCtx({columns, rows: [[report]]});
    await Timeline(ctx);

    cardTests(ctx, {
      id: 'reportId',
      Date: '2016-11-08T12:00:33.000',
      display: {
        sourceDest: null,
        Type: {
          displayKey: true,
          value: 'Report'
        },
        'File Name': {
          displayKey: true,
          value: 'pafish.exe'
        },
        sha256: {
          displayKey: true,
          value: 'd309ca97de4f5a3aa203cdac46d8dc23ba1d1a47b24c24139b885ab5186b7eba'
        },
        Status: {
          displayKey: true,
          value: 'ANALYZED'
        },
        Score: {
          displayKey: true,
          value: '80'
        },
        'Mime Type': {
          displayKey: true,
          value: 'application/x-msdownload; format=pe32'
        }
      }
    });
  });

  it('returns alert card', async function() {
    const ctx = getCtx({columns, rows: [[alert]]});
    await Timeline(ctx);

    cardTests(ctx, {
      id: 'alertId',
      Date: '2016-11-08T04:54:15.592',
      display: {
        sourceDest: null,
        Type: {
          displayKey: true,
          value: 'Alert'
        },
        Severity: {
          displayKey: true,
          value: 'LOW'
        },
        Signature: {
          displayKey: true,
          value: 'ET SCAN SSH BruteForce Tool with fake PUTTY version'
        },
        Category: {
          displayKey: true,
          value: 'Detection of a Network Scan'
        }
      }
    });
  });

  it('returns rank_alert card', async function() {
    const ctx = getCtx({columns, rows: [[rankAlert]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'rankId',
      'Date': null,
      'Type': 'Rank Alert',
      'display': {
        'sourceDest': null,
        'Description': {
          displayKey: true,
          value: 'Rank alert card desc'
        },
        'Message': {
          displayKey: true,
          value: 'Rank alert card message'
        },
        'Category': {
          displayKey: true,
          value: 'Rank alert card category'
        },
        'Score': {
          displayKey: true,
          value: '65'
        }
      }
    });
  });

  it('returns winevent card', async function() {
    const winevent = {
      id: 'winid',
      date: '2016-11-08T04:54:15.592',
      type: 'winevent',
      data: {
        winevent: {
          Message: 'Message',
          EventType: 'winevent',
          Category: 'Category',
          SourceName: 'Source',
          Severity: 'Severity',
          SeverityValue: 'SeverityValue'
        }
      }
    };

    const ctx = getCtx({columns, rows: [[winevent]]});
    await Timeline(ctx);

    cardTests(ctx, {
      id: 'winid',
      Date: null,
      display: {
        Type: {
          displayKey: true,
          value: 'winevent'
        },
        Message: {
          displayKey: true,
          value: 'Message'
        },
        Category: {
          displayKey: true,
          value: 'Category'
        },
        Source: {
          displayKey: true,
          value: 'Source'
        },
        Severity: {
          displayKey: true,
          value: 'Severity'
        },
        'Severity Value': {
          displayKey: true,
          value: 'SeverityValue'
        }
      }
    });
  });

  it('returns anomaly card', async function() {
    const ctx = getCtx({columns, rows: [[anomaly]]});
    await Timeline(ctx);

    cardTests(ctx, {
      id: 'anomalyId',
      Date: '2016-10-13T00:00:00.000',
      Type: 'Anomaly',
      display: {
        Impact: {
          displayKey: false,
          value: 'Data Exfiltration'
        },
        'Anomaly Description': {
          displayKey: false,
          value: 'Abnormal number of connections by host to given country'
        }
      }
    });
  });

  it('returns rdp card', async function() {
    const rdp = {
      'date': '2016-11-08T04:54:15.592',
      destination,
      'id': 'rdpId',
      source,
      'type': 'rdp'
    };

    const ctx = getCtx({columns, rows: [[rdp]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'rdpId',
      'Date': null,
      display: {
        'sourceDest': null,
        'Type': {
          displayKey: true,
          value: 'rdp'
        }
      }
    });
  });

  it('returns auth card', async function() {
    const auth = {
      'date': '2016-11-08T04:54:15.592',
      'id': 'authId',
      'type': 'Auth',
      data: {
        auth: {
          message: 'sample',
          severity: '1',
          'severity_label': 'label',
          status: 'yo',
          priority: 10
        }
      }
    };

    const ctx = getCtx({columns, rows: [[auth]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'id': 'authId',
      'Date': null,
      'display': {
        'Type': {
          displayKey: true,
          value: 'Auth'
        },
        'Message': {
          displayKey: true,
          value: null
        },
        'Severity': {
          displayKey: true,
          value: null
        },
        'Status': {
          displayKey: true,
          value: null
        },
        'Priority': {
          displayKey: true,
          value: null
        }
      }
    });
  });

  describe('returns session card', () => {
    const urls = {
        user: {
          url: 'analytics/reporting/execute/taf_asset_session_details?window=1mo&asset=root&type=user&user=root'
        },
        machine: {
          url: 'analytics/reporting/execute/taf_asset_session_details?window=1mo&asset=demo&type=machine&machine=demo'
        }
      },
      session = {
        'lastSeen': '2016-10-30T00:15:01.271',
        'machine': 'demo-slave-2.aws.demo.ranksoftwareinc.com',
        'session': {
          'ready': true,
          'updated': '2016-10-30T00:15:01.907',
          'durationMs': 2
        },
        'origin': 'live',
        'from': '2016-10-30T00:00:00.000',
        'pid': '23634',
        'to': '2016-10-30T00:00:00.000',
        'id': 'sessionId',
        'type': 'LOGON',
        'user': 'root'
      },
      sessionCardMachine = {
        'id': 'sessionId',
        'Date': '2016-10-30T00:00:00.000',
        'Type': 'Session',
        'endDate': '2016-10-30T00:00:00.000',
        'display': {
          'User': {
            displayKey: true,
            value: 'root'
          }
        }
      },
      sessionCardUser = {
        'id': 'sessionId',
        'Date': '2016-10-30T00:00:00.000',
        'Type': 'Session',
        'endDate': '2016-10-30T00:00:00.000',
        'display': {
          'Machine': {
            displayKey: true,
            value: 'demo-slave-2.aws.demo.ranksoftwareinc.com'
          }
        }
      };

    it('returns session card', async function() {
      const ctx = getCtx({columns, rows: [[session]]}, urls.user.url);
      await Timeline(ctx);
      cardTests(ctx, sessionCardUser);
    });

    it('if asset type is user, then session card should display Machine and not User', async function() {
      expect(sessionCardUser.display).to.have.property('Machine');
    });

    it('if asset type is machine, then session card should display User and not Machine', async function() {
      expect(sessionCardMachine.display).to.have.property('User');
    });
  });

  it('returns default card', async function() {
    const misc = {
      type: 'misc',
      date: '2016-11-08T12:00:32.580',
      id: 'miscId'
    };

    const ctx = getCtx({columns, rows: [[misc]]});
    await Timeline(ctx);

    cardTests(ctx, {
      'Type': 'misc',
      'Date': null,
      'id': 'miscId'
    });
  });
});
