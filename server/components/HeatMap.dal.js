import {getColumnIndex} from '../../commons/utils/chartUtils';
import {militaryTimeToNormalTime} from '../../commons/utils/utils';

export function getData(data) {
  const {rows, columns} = data;

  if (!(rows && rows.length > 0)) {
    return;
  }

  const yAxis = getColumnIndex(columns, 'minutesOfActivity'),
    dayIndex = getColumnIndex(columns, 'dayOfWeek'),
    hourIndex = getColumnIndex(columns, 'hourOfDay'),
    dataObj = [];

  rows.forEach(row => {
    const yValue = row[yAxis.index],
      rowid = militaryTimeToNormalTime(row[hourIndex.index]),
      columnid = row[dayIndex.index];

    const temp = {
      'rowid': rowid + '',
      'columnid': columnid + '',
      'value': yValue
    };

    dataObj.push(temp);
  });

  return {
    dataset: [{data: dataObj}]
  };
};


export default async function Heatmap(ctx) {
  let parsedData = await ctx.tempData;
  if (!parsedData.errorCode) {
    const normalizeData = getData(parsedData);
    parsedData.normalizeData = normalizeData;
    ctx.normalizeData = parsedData;
  }
}
