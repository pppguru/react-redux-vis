import React from 'react';
import moment from 'moment';

const timeParams = {
  '1h': {
    diffInMin: 5,
    functionName: 'hour',
    diffInUnits: 1
  },
  '6h': {
    diffInMin: 15,
    functionName: 'hour',
    diffInUnits: 6
  },
  '12h': {
    diffInMin: 30,
    functionName: 'hour',
    diffInUnits: 12
  },
  '24h': {
    diffInMin: 60,
    functionName: 'date',
    diffInUnits: 1
  },
  '48h': {
    diffInMin: 120,
    functionName: 'date',
    diffInUnits: 2
  },
  '1d': {
    diffInMin: 60,
    functionName: 'date',
    diffInUnits: 1
  },
  '1w': {
    diffInMin: 1440,
    functionName: 'date',
    diffInUnits: 7
  },
  '1mo': {
    diffInMin: 10080,
    functionName: 'month',
    diffInUnits: 1
  },
  '2mo': {
    diffInMin: 20160,
    functionName: 'month',
    diffInUnits: 2
  }
};

// Function to convert milliseconds to time
export function msToTime(duration) {
  let seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? '0' + hours : hours;
  minutes = (minutes < 10) ? '0' + minutes : minutes;
  seconds = (seconds < 10) ? '0' + seconds : seconds;

  return {
    'timeArray': [hours, minutes, seconds],
    'timeString': hours + ' : ' + minutes + ' : ' + seconds
  };
}

// Function to generate row data
export function generateRawData(fieldMapping, apiData) {
  let rawData = {};
  if (apiData === null) {
    return;
  }
  for (let i = 0; i < fieldMapping.length; i++) {
    let currentChartData = fieldMapping[i];
    if (!rawData.hasOwnProperty(currentChartData.reportId)) {
      rawData[currentChartData.reportId] = apiData[currentChartData.reportId] !== undefined
        ? apiData[currentChartData.reportId]
        : apiData;
    }
  }
  return rawData;
}

// Function to get index from column name specified in layout JSON
export function getIndexFromColumnName(currentChartDataColumns, columnsArray) {
  let columnIndex = '';
  for (let i = 0; i < currentChartDataColumns.length; i++) {
    for (let j = 0; j < columnsArray.length; j++) {
      if (currentChartDataColumns[i] === columnsArray[j].name) {
        columnIndex = j;
        break;
      }
    }
  }
  return columnIndex;
}

// Function to get column index array from column names specified in layout JSON
export function getColumnIndexArrayFromColumnName(currentChartDataColumns, columnsArray) {
  let columnIndexArray = [];
  for (let a = 0; a < currentChartDataColumns.length; a++) {
    for (let c = 0; c < columnsArray.length; c++) {
      if (currentChartDataColumns[a] === columnsArray[c].name) {
        columnIndexArray[a] = c;
        break;
      }
    }
  }
  return columnIndexArray;
}

// Function to get x and y indexes from column names specified in layout JSON
export function getXYIndexFromColumnNames(currentChartDataColumns, columnsArray) {
  let xColumnIndex = '',
    yColumnIndex = '';
  for (let c = 0; c < columnsArray.length; c++) {
    if (currentChartDataColumns[0] === columnsArray[c].name) {
      xColumnIndex = c;
    }
    if (currentChartDataColumns[1] === columnsArray[c].name) {
      yColumnIndex = c;
    }
  }
  return [xColumnIndex, yColumnIndex];
}

// Function to get field value from object name specified in layout JSON
export function getIndexFromObjectName(inputArray) {
  let {fieldName, dataArray: fieldValue} = inputArray;
  let fieldValueArray = fieldName.includes('.') ? fieldName.split('.') : [fieldName];

  fieldValueArray.forEach((arrayValue) => {
    if (!arrayValue.includes('[') && !arrayValue.includes(']')) {
      fieldValue = fieldValue[arrayValue];
    }
    else {
      let tempArray = arrayValue.split('[');
      let arrayName = tempArray[0],
        arrayIndex = tempArray[1].replace('[', '');
      arrayIndex = arrayIndex.replace(']', '');
      if (!isUndefined(fieldValue)) {
        fieldValue = fieldValue[arrayName];
      }
      if (!isUndefined(fieldValue)) {
        fieldValue = fieldValue[arrayIndex];
      }
    }

    if (isUndefined(fieldValue)) {
      fieldValue = '';
      return false;
    }
  });

  return fieldValue;
}

// Function to check for undefined chartOption object
export function checkForUndefinedChartOptionObject(chartOptions, objectName, defaultValue) {
  let value = defaultValue;
  if (!isUndefined(chartOptions) && chartOptions[objectName] !== undefined) {
    value = chartOptions[objectName];
  }
  return value;
}

// Function to translate time window
export function translateTimeWindow(window) {
  if (window === '1 hour') return '1h';
  else if (window === '6 hour') return '6h';
  else if (window === '12 hour') return '12h';
  else if (window === '24 hour') return '24h';
  else if (window === '48 hour') return '48h';
  else if (window === '1 day') return '1d';
  else if (window === '1 week') return '1w';
  else if (window === '1 month') return '1mo';
  else if (window === '2 month') return '2mo';

  else if (window === '1h') return '1 hour';
  else if (window === '6h') return '6 hour';
  else if (window === '12h') return '12 hour';
  else if (window === '24h') return '24 hour';
  else if (window === '48h') return '48 hour';
  else if (window === '1d') return '1 day';
  else if (window === '1w') return '1 week';
  else if (window === '1mo') return '1 month';
  else if (window === '2mo') return '2 month';
  else return window;
}

export function isUndefined(value) {
  return value === undefined;
}

export function isNull(value) {
  return value === null;
}

function addZero(x, n) {
  while (x.toString().length < n) {
    x = '0' + x;
  }
  return x;
}

// Format Date in YYYY-MM-DDThh:mm:ss format
export function formatDate(date) {
  let dd = date.getDate();
  let mm = date.getMonth() + 1;// January is 0!
  let yyyy = (date.getFullYear());
  if (dd < 10) {
    dd = '0' + dd;
  }
  if (mm < 10) {
    mm = '0' + mm;
  }

  let hh = addZero(date.getHours(), 2);
  let min = addZero(date.getMinutes(), 2);
  let ss = addZero(date.getSeconds(), 2);
  let milisec = addZero(date.getMilliseconds(), 3);
  milisec = (milisec !== '' || milisec !== 0 || milisec !== '0') ? '.' + milisec : milisec;

  let formattedDateString = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + ss + milisec;

  return formattedDateString;
}

// function to format Date In Local TimeZone
export function formatDateInLocalTimeZone(value) {
  let value1 = moment.utc(value).format('YYYY-MM-DD HH:mm:ss.SSS'),
    dateTime = {
      date: '',
      time: ''
    },
    localDateTime = moment.utc(value1).toDate();
  dateTime.date = moment(localDateTime).format('DD MMM YYYY');
  dateTime.time = moment(localDateTime).format('HH:mm:ss.SSS');
  return dateTime;
}

function getFromDate(params, todayDate, fromDate) {
  if (params.functionName === 'hour') {
    fromDate.setHours(todayDate.getHours() - params.diffInUnits);
  }
  else if (params.functionName === 'date') {
    fromDate.setDate(todayDate.getDate() - params.diffInUnits);
  }
  else if (params.functionName === 'month') {
    fromDate.setMonth(todayDate.getMonth() - params.diffInUnits);
  }
  return fromDate;
}

// Function to get from and to dates for the specific time window
export function getTimePairFromWindow(timeWindow, dateString) {
  let dateString1 = '',
    dateString2 = '';

  if (dateString !== '') {
    dateString = dateString.replace(/-/g, '/');
    let dateParameter = new Date(Date.parse((dateString).toString()));
    dateString1 = formatDate(dateParameter);

    let timeDifference = timeParams[timeWindow] ? timeParams[timeWindow].diffInMin : 5,
      toDate = dateParameter;
    toDate.setMinutes(toDate.getMinutes() + timeDifference);
    dateString2 = formatDate(toDate);
    return {fromDate: dateString1, toDate: dateString2};
  }
  else {
    let todayDate = new Date(),
      fromDate = todayDate;
    fromDate = getFromDate(timeParams[timeWindow], todayDate, fromDate);
    dateString1 = formatDate(new Date());
    dateString2 = formatDate(fromDate);
    return {fromDate: dateString2, toDate: dateString1};
  }
}



function numberToReactElm(val, text, {numberStyle, textStyle} = {}) {
  return (
    <span>
      <span style={numberStyle}>{val}</span>
      <span style={textStyle}>{text}</span>
    </span>
  );
}

export function formatBytes(bytes, decimals, {numberStyle, textStyle} = {}) {
  if (bytes === '' || bytes === undefined || typeof bytes !== 'number') return '-';

  if (bytes === 0) {
    return numberStyle ? numberToReactElm(0, 'Byte', {numberStyle, textStyle}) : '0 Byte';
  }

  const k = 1000,
    dm = decimals + 1 || 3,
    sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

  const val = (bytes / Math.pow(k, i)).toPrecision(dm),
    text = sizes[i];

  // if custom sytles are provided then return React Element.
  return numberStyle ? numberToReactElm(val, text, {numberStyle, textStyle}) : val + ' ' + text;
};

export function kFormatter(num) {
  return num > 999 ? (num / 1000).toFixed(2) + 'k' : num;
}

export function firstCharCapitalize(string) {
  if (string === undefined) {
    return string;
  }
  else {
    if (string.toLowerCase() === 'ip') {
      return string.toUpperCase();
    }
    if (string.includes('_')) {
      string = string.replace('_', ' ');
    }

    string = string.toLowerCase().replace(/\b\w/g, function(m) {
      return m.toUpperCase();
    });

    if (string.includes(' Ip')) {
      string = string.replace(' Ip', ' IP');
    }
  }
  return string;
};

export function nFormatter(num, digits, {numberStyle}) {
  const si = [
      { value: 1E18, symbol: 'E' },
      { value: 1E15, symbol: 'P' },
      { value: 1E12, symbol: 'T' },
      { value: 1E9, symbol: 'G' },
      { value: 1E6, symbol: 'M' },
      { value: 1E3, symbol: 'k' }
    ],
    rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      const digits = (num / si[i].value).toFixed(digits).replace(rx, '$1'),
        text = si[i].symbol;
      if (numberStyle) {
        return numberToReactElm(digits, text);
      }
      else {
        return digits + text;
      }
    }
  }

  return num.toFixed(digits).replace(rx, '$1');
}

export function parseQuery(qstr) {
  const query = {},
    arr = qstr.split('&');

  arr.forEach(val => {
    const b = val.split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  });

  return query;
}

let stringConstructor = 'test'.constructor;
let arrayConstructor = [].constructor;
let objectConstructor = {}.constructor;

export function whatIsIt(object) {
  if (object === null) {
    return 'null';
  }
  else if (object === undefined) {
    return 'undefined';
  }
  else if (object.constructor === stringConstructor) {
    return 'String';
  }
  else if (object.constructor === arrayConstructor) {
    return 'Array';
  }
  else if (object.constructor === objectConstructor) {
    return 'Object';
  }
  else if (typeof object === 'number') {
    return 'Number';
  }
  else {
    return 'unknown';
  }
}

export function getFieldValue(data, fieldName) {
  if (fieldName.includes('.')) {
    let attributes = fieldName.split('.'),
      fieldValue = data;
    attributes.forEach((attribute, index) => {
      fieldValue = fieldValue[attribute];
    });
    return fieldValue;
  }
  else {
    return data[fieldName];
  }
}

export function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function getEventTypeString(typeName) {
  const typeStrings = {
    conn: 'Connection',
    ssh: 'SSH',
    dns: 'DNS',
    http: 'HTTP',
    ssl: 'SSL',
    files: 'File',
    rank_alert: 'Rank Alert',
    alert: 'Alert',
    sysmon: 'Sysmon',
    report: 'Report',
    anomaly: 'Anomaly',
    auth: 'Auth',
    'resource-access': 'Resource Access'
  };

  return typeStrings[typeName] ? typeStrings[typeName] : typeName;
};

export function militaryTimeToNormalTime(time) {
  time = time.toString().split(':'); // convert to array

  const hours = Number(time[0]);

  let timeValue = '';
  if (hours > 12) {
    timeValue += hours - 12;
  }
  else {
    timeValue += hours === 0 ? 12 : hours;
  }
  timeValue += (hours >= 12) ? ' PM' : ' AM';  // get AM/PM

  return timeValue;
}

export function getDateTimeInLocalTimeZone(dateTime, format) {
  let localDateTime = moment.utc(dateTime).toDate();
  localDateTime = moment(localDateTime).format(format);
  return localDateTime;
}

export function displayEllipsis(str, range) {
  let max = 40,
    min = 18;
  if (range) {
    max = range.max;
    min = range.min;
  }
  if (str && str.length > max) {
    return str.substr(0, min) + ' ... ' + str.substr(str.length - min, str.length);
  }
  return str;
}

// Function to get index/value from column name/index specified in layout JSON
export function getColumnIndexOrValue(jsonColumns, apiColumns, data) {
  let index = '';
  jsonColumns.forEach((jsonColumn) => {
    if (jsonColumn.type === 'name') {
      apiColumns.forEach((apiColumn, colIndex) => {
        if (jsonColumn.name === apiColumn.name) {
          index = colIndex;
        }
      });
    }
    else if (jsonColumn.type === 'index') {
      index = getIndexFromObjectName({fieldName: jsonColumn.name, dataArray: data});
    }
  });
  return index;
}

export function isEmpty(value) {
  let isEmpty = false;
  if ((whatIsIt(value) === 'String') && value === '') {
    isEmpty = true;
  }
  else if (whatIsIt(value) === 'Array' && value.length === 0) {
    isEmpty = true;
  }
  else if (whatIsIt(value) === 'Object' && Object.keys(value).length === 0) {
    isEmpty = true;
  }
  return isEmpty;
}

export function isValidDate(value) {
  return (new Date(value).toString() !== 'Invalid Date');
}

export function isZero(value) {
  return (parseInt(value) === 0);
}

export function isNotNA(value) {
  return (value !== 'N/A');
}

export function isBetween(value, min, max) {
  return (min <= value && max >= value);
}

export function getColumnIndexes(columns, apiColumns) {
  let columnIndexes = {};
  // Calculate column index from API response
  for (let column in columns) {
    apiColumns.forEach((apiColumn, apiColIndex) => {
      if (columns[column] === apiColumn.name) {
        columnIndexes[column] = apiColIndex;
        return false;
      }
    });
  }
  return columnIndexes;
}

export function getValue(value) {
  if (value === true) {
    return 'True';
  }
  else if (value === false) {
    return 'False';
  }
  return value;
}
