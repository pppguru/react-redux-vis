import {readFileThunk} from '../utils/utils';
import {
  getColumnIndexOrValue,
  generateRawData
} from '../../commons/utils/utils';

const path = require('path');

function getPieJsonPath(url) { // This url is a proxy server url.
  let reportId = url.split('?');
  reportId = reportId[0];
  reportId = reportId.split('/');
  reportId = reportId[reportId.length - 1];

  const fileName = `../json/pieChart/${reportId}.json`,
    filePath = path.join(__dirname, fileName);

  return filePath;
}

function getPieProps(rawData, pieJson) {
  const fieldMapping = pieJson.chart.data.fieldMapping,
    options = pieJson.chart.options,
    data = generateRawData(fieldMapping, rawData);

  let countValue = 0,
    totalValue = 0,
    topCountValue = 0,
    topTotalValue = 0;

  fieldMapping.forEach((api) => {
    let {rows, columns} = data[api.reportId];
    topCountValue = 0;
    topTotalValue = 0;

    rows.forEach((row) => {
      let index = getColumnIndexOrValue(api.columns, columns, row),
        value = getValue(api.columns[0].type, index, row);
      if (api.returnValueIs === 'countValue') {
        countValue = value;
      }
      else if (api.returnValueIs === 'totalValue') {
        totalValue = value;
      }
      else if (api.returnValueIs === 'topValue') {
        let total = Math.round(((value * 100) / totalValue), 2);
        if (total > 0) {
          topCountValue = topCountValue + 1;
          topTotalValue = topTotalValue + parseInt(value);
        }
      }
    });
  });

  let values = {
    countValue,
    totalValue,
    topCountValue,
    topTotalValue
  };

  return calculatePercentage(values, options);
}

function getValue(columnType, index, data) {
  let value = 0;
  if (columnType === 'name') {
    value = data[index];
  }
  else if (columnType === 'index') {
    value = index;
  }
  return value;
}

export function calculatePercentage(values, options) {
  let pieProps = {},
    assetPercentage = Math.round((values.topCountValue / parseInt(values.countValue)) * 100, 2),
    piePercentage = Math.round((values.topTotalValue / parseInt(values.totalValue)) * 100, 2);

  if (piePercentage > 100) {
    piePercentage = 100;
  }

  assetPercentage = isNaN(assetPercentage) ? '0' : assetPercentage.toString();
  piePercentage = isNaN(piePercentage) ? '0' : piePercentage.toString();

  pieProps = {
    assetPercentage,
    piePercentage
  };
  return pieProps;
}

export default async function PieChart(ctx, next) {
  let data = ctx.tempData;

  if (data && !data.errorCode) {
    const filePath = getPieJsonPath(ctx.request.url);
    let pieJson = await readFileThunk(filePath);
    pieJson = JSON.parse(pieJson.toString());

    ctx.normalizeData = Object.assign({}, data, {
      pieProps: getPieProps(data, pieJson),
      pieJson
    });
  }
};
