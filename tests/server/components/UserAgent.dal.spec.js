import UserAgent from '../../../server/components/UserAgent.dal';
import {getCtx} from '../../testUtils';

const columns = [
  {
    'name': 'data.http.__info.userAgentLen',
    'displayName': 'data.http.__info.userAgentLen',
    'columnType': 'DIMENSION',
    'dataType': 'NUMBER',
    'sortable': true,
    'detailsAvailable': true
  },
  {
    'name': 'data.http.userAgent',
    'displayName': 'data.http.userAgent',
    'columnType': 'DIMENSION',
    'dataType': 'TEXT',
    'sortable': true,
    'detailsAvailable': true
  },
  {
    'name': 'date',
    'displayName': 'date',
    'columnType': 'MEASURE',
    'dataType': 'NUMBER',
    'sortable': true,
    'detailsAvailable': false
  }
];

// DAL stands for Data Abstraction Layer.
describe('UserAgent DAL', () => {
  it('exists', async function() {
    const result = await UserAgent;
    expect(result).to.exist;
  });

  it('returns undefined if api returns error', async function() {
    const ctx = getCtx({errorCode: 404});
    await UserAgent(ctx);
    const {normalizeData: result} = ctx;
    expect(result).to.be.undefined;
  });

  it('returns blank array of normalizeData if rows are blank', async function() {
    const ctx = getCtx({columns, rows: []});
    await UserAgent(ctx);

    const {normalizeData: {normalizeData: result}} = ctx;
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(0);
  });

  it('returns correct normalized data', async function() {
    const row = {
      '40': {
        'Apache-HttpClient/4.5.2 (Java/1.8.0_102)': [
          20163
        ]
      }
    };

    const ctx = getCtx({columns, rows: [row]});
    await UserAgent(ctx);

    const {normalizeData: {normalizeData: result}} = ctx;
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(1);

    const [card] = result;
    expect(card).to.be.an('object');

    for (let [key, value] of Object.entries(result)) {
      expect(value.x).to.be.an('number');
      expect(value.y).to.be.an('number');
      expect(value.toolText).to.be.an('string');
    }
  });

  it('returns multiple user agents at single point', async function() {
    const row = {
      '40': {
        'Apache-HttpClient': [
          20163
        ],
        'curl/7.35.0': [
          2436
        ]
      }
    };

    const ctx = getCtx({columns, rows: [row]});
    await UserAgent(ctx);

    const {normalizeData: {normalizeData: result}} = ctx;
    expect(result).to.be.an('array');
    expect(result).to.have.lengthOf(1);

    const [card] = result;
    expect(card).to.be.an('object');

    for (let [key, value] of Object.entries(result)) {
      expect(value.x).to.be.an('number');
      expect(value.x).to.be.equal(40);
      expect(value.y).to.be.an('number');
      expect(value.y).to.be.equal(22599);
      expect(value.toolText).to.be.an('string');
      let toolText = 'Apache-HttpClient | 20163{br}curl/7.35.0 | 2436{br}';
      expect(value.toolText).to.be.equal(toolText);
    }
  });
});
