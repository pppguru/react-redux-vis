import {readFileThunk} from '../utils/utils';
import {processData} from '../utils/tableUtils';
import {getParameterByName} from '../../commons/utils/utils';

const path = require('path');

function getTableJsonPath(url) {
  let reportId = url.split('?'),
    type = getParameterByName('type', url);

  reportId = reportId[0];
  reportId = reportId.split('/');
  reportId = reportId[reportId.length - 1];

  if (type && type !== '') {
    reportId = reportId + '-' + type;
  }

  const fileName = `../json/table/${reportId}.json`,
    filePath = path.join(__dirname, fileName);

  return filePath;
}

export default async function Table(ctx, next) {
  let data = ctx.tempData;

  if (data && !data.errorCode) {
    const filePath = getTableJsonPath(ctx.request.url);
    let tableJson = await readFileThunk(filePath);
    tableJson = JSON.parse(tableJson.toString());

    ctx.normalizeData = Object.assign({}, data, {
      normalizeData: processData(data, tableJson, ctx.request.url),
      tableJson
    });
  }
};
