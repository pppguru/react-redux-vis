import anomalyChart from '../../../server/components/anomalyChart';

const columns = [
  {
    'name': 'bucket',
    'displayName': 'bucket',
    'columnType': 'DIMENSION',
    'sortable': true
  },
  {
    'name': 'current',
    'displayName': 'current',
    'columnType': 'MEASURE',
    'sortable': true
  },
  {
    'name': 'baseline',
    'displayName': 'baseline',
    'columnType': 'MEASURE',
    'sortable': true
  },
  {
    'name': 'outlier',
    'displayName': 'outlier',
    'columnType': 'MEASURE',
    'sortable': true
  }
];

const uiConfig = {
  'current': 'Line',
  'outlier': 'Point',
  'xAxisLabel': 'Country',
  'baseline': 'Area',
  'type': 'combination',
  'title': 'Connection count - all countries (2016-Oct-13)'
};

// DAL stands for Data Abstraction Layer.
describe('Anomaly Chart DAL', () => {
  it('exists', () => {
    const result = anomalyChart;
    expect(result).to.exist;
  });

  it('returns undefined if uiConfig is not defined', () => {
    const ctx = null;
    const result = anomalyChart(ctx);
    expect(result).to.be.undefined;
  });

  it("returns undefined if it is an Object of graphs Objects but don't have uiConfig", () => {
    let data = { 0: {} };
    const result = anomalyChart(data);
    expect(result).to.be.undefined;
  });

  it('returns a blank object if rows are empty array', () => {
    let data = {
      uiConfig: { type: 'combination' },
      rows: [],
      columns: []
    };

    const result = anomalyChart(data);
    expect(result).to.be.an('object');
    expect(result).to.deep.equal({});
  });

  it('returns [] if it is an Object of graphs Objects but rows are empty', () => {
    let data = {
      0: {uiConfig: { type: 'combination' }, rows: [], columns: []},
      1: {uiConfig: { type: 'combination' }, rows: [], columns: []}
    };

    const result = anomalyChart(data);
    expect(result).to.be.an('object');
    expect(result).to.deep.equal({});
  });

  it('returns category object, where column name equals "bucket" for index from columns array', () => {
    const rows = [['A1', -7.549516567451064e-15, 0.5463775184570068, 0]];
    let data = { uiConfig: { type: 'combination' }, rows, columns };
    const result = anomalyChart(data);
    expect(result).to.be.an('object');
    expect(result).to.have.property('0');

    const categories = result[0].categories;
    expect(categories).to.exist;
    expect(categories).to.be.an('array');
    expect(categories).to.have.lengthOf(1);

    const category = categories[0].category;
    expect(category).to.exist;
    expect(category).to.be.an('array');
    expect(category).to.have.lengthOf(1);
    expect(category[0]).to.deep.equal({label: 'A1'});
  });

  it('returns category object, and empty dataset array since outlier value is 0', () => {
    const rows = [['A1', -7.549516567451064e-15, 0.5463775184570068, 0]],
      data = { uiConfig: { type: 'combination' }, rows, columns },
      result = anomalyChart(data),
      dataset = result[0].dataset;

    expect(dataset).to.exist;
    expect(dataset).to.be.an('array');
    expect(dataset).to.have.lengthOf(0);
  });

  // it('returns category object, and dataset array', () => {
  //   const rows = [
  //       ['A1', -7.549516567451064e-15, 0.5463775184570068, 1],
  //       ['B1', 160, 20, 1]
  //     ],
  //     data = { uiConfig, rows, columns },
  //     result = anomalyChart(data),
  //     dataset = result[0].dataset;

  //   expect(dataset).to.exist;
  //   expect(dataset).to.be.an('array');
  //   expect(dataset).to.have.lengthOf(3);

  //   const [current, outlier, baseline] = dataset;
  //   expect(current).to.have.property('seriesname', 'current');
  //   expect(current).to.have.property('renderAs', 'line');
  //   expect(current).to.have.property('data')
  //     .that.is.an('array')
  //     .that.deep.equals([
  //       { value: '0.00', toolText: 'current, A1, 0.00, 0' },
  //       { value: '2.20', toolText: 'current, B1, 2.20, 160' }
  //     ]);

  //   expect(outlier).to.have.property('seriesname', 'outlier');
  //   expect(outlier).to.have.property('renderAs', 'line');
  //   expect(outlier).to.have.property('data')
  //     .that.is.an('array')
  //     .that.deep.equals([
  //       { value: '0.00', toolText: 'outlier, A1, 0.00, 0' },
  //       { value: '2.20', toolText: 'outlier, B1, 2.20, 160' }
  //     ]);

  //   expect(baseline).to.have.property('seriesname', 'baseline');
  //   expect(baseline).to.have.property('renderAs', 'area');
  //   expect(baseline).to.have.property('data')
  //     .that.is.an('array')
  //     .that.deep.equals([
  //       { value: '0.00', toolText: 'baseline, A1, 0.00, 1' },
  //       { value: '1.30', toolText: 'baseline, B1, 1.30, 20' }
  //     ]);
  // });

  it('returns one graph array, if it is a data Object', () => {
    const rows = [['A1', -7.549516567451064e-15, 0.5463775184570068, 0]];
    let data = { uiConfig: { type: 'combination' }, rows, columns };
    const result = anomalyChart(data);
    expect(result).to.be.an('object');
    expect(result).to.have.property('0');
  });

  it('returns multiple graph array, if it is an of graph Objects', () => {
    const rows = [
      ['A1', -7.549516567451064e-15, 0.5463775184570068, 1],
      ['B1', 160, 20, 1]
    ];
    let data = {
      'c': {uiConfig, rows, columns},
      'a': {uiConfig, rows, columns}
    };
    const result = anomalyChart(data);
    expect(result).to.be.an('object');
    expect(result).to.have.property('c');
    expect(result).to.have.property('a');

    const {c, a} = result,
      cDataset = c.dataset,
      aDataset = a.dataset;

    expect(cDataset).to.exist;
    expect(cDataset).to.be.an('array');
    expect(cDataset).to.have.lengthOf(3);

    expect(aDataset).to.exist;
    expect(aDataset).to.be.an('array');
    expect(aDataset).to.have.lengthOf(3);
  });
});
