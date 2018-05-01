import {getCtx, getRandomIntInclusive} from '../../testUtils';
import Heatmap from '../../../server/components/HeatMap.dal.js';

const columns = [
  {
    'name': 'dayOfWeek',
    'displayName': 'Day Of Week',
    'columnType': 'DIMENSION',
    'dataType': 'TEXT',
    'sortable': true
  },
  {
    'name': 'hourOfDay',
    'displayName': 'Hour Of Day',
    'columnType': 'DIMENSION',
    'dataType': 'TEXT',
    'sortable': true
  },
  {
    'name': 'minutesOfActivity',
    'displayName': 'Activity (in minutes)',
    'columnType': 'MEASURE',
    'dataType': 'NUMBER',
    'sortable': true
  }
];

function generateSessionData() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const data = [];
  days.forEach(day => {
    for (let i = 0; i < 24; i++) {
      data.push([day, i, getRandomIntInclusive(0, 100)]);
    }
  });

  return data;
}

const rows = generateSessionData();

describe('Heatmap DAL', () => {
  it('exists', async function() {
    const result = await Heatmap;
    expect(result).to.exist;
  });

  describe('should return undefined if api returns ', () => {
    it('404 error', async function() {
      const ctx = getCtx({errorCode: 404});
      await Heatmap(ctx);
      const {normalizeData: result} = ctx;
      expect(result).to.be.undefined;
    });

    it('500 error', async function() {
      const ctx = getCtx({errorCode: 500});
      await Heatmap(ctx);
      const {normalizeData: result} = ctx;
      expect(result).to.be.undefined;
    });
  });

  it('should return undefined if rows are blank', async function() {
    const ctx = getCtx({columns, rows: []});
    await Heatmap(ctx);

    const {normalizeData: {normalizeData}} = ctx,
      data = normalizeData;

    expect(data).to.be.undefined;
  });

  describe('should', function() {
    it('return 168 rows of data', async function() {
      const ctx = getCtx({columns, rows});
      await Heatmap(ctx);

      const {normalizeData: {normalizeData}} = ctx,
        data = normalizeData.dataset[0].data;

      expect(normalizeData.dataset).to.exist;
      expect(normalizeData.dataset).to.be.an('array');
      expect(normalizeData.dataset).to.have.lengthOf(1);
      expect(data).to.be.an('array');
      expect(data).to.have.lengthOf(168);
    });

    it('return data with proper structure', async function() {
      const ctx = getCtx({columns, rows});
      await Heatmap(ctx);

      const {normalizeData: {normalizeData}} = ctx,
        data = normalizeData.dataset[0].data;

      const row = data[0];
      expect(row).to.have.property('rowid');
      expect(row).to.have.property('columnid');
      expect(row).to.have.property('value');
    });
  });
});
