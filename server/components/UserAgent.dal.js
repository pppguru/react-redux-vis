function processData(rawData) {
  let rows = rawData.rows,
    processedData = [];

  rows.forEach((row, index) => {
    for (let userAgentLen in row) {
      let dataPoint = {},
        connections = 0,
        details = '';

      for (let userAgent in row[userAgentLen]) {
        let connection = row[userAgentLen][userAgent][0];
        connections += connection;
        userAgent = userAgent !== '' ? userAgent : '< empty >';
        details += userAgent + ' | ' + connection + '{br}';
      }

      dataPoint.x = parseInt(userAgentLen);
      dataPoint.y = connections;
      dataPoint.toolText = details;
      processedData.push(dataPoint);
    }
  });

  return processedData;
}

export default async function Table(ctx, next) {
  let rawData = await ctx.tempData;

  if (!rawData.errorCode) {
    const data = processData(rawData);
    rawData.normalizeData = data;
    ctx.normalizeData = rawData;
  }
};
