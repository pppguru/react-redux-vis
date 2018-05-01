export function getColumnIndex(columns, name, type) {
  let index = null, col = null;
  columns.forEach((column, i) => {
    if (column.name === name || column.columnType === type) {
      index = i;
      col = column;
      return;
    }
  });

  return {index, col};
}

export function getDataByIndex(data, index, label, callback) {
  return data.map((val, i) => {
    let value = val[index] === 'N/A' ? 0 : val[index];

    if (callback) {
      return callback(value, i);
    }
    return {
      [label]: value
    };
  });
}
