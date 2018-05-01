import moment from 'moment';
import { DATE_REG_EX } from 'Constants';
import {isNumber} from './utils';

export function calculateDateDisplayFormat(input) {
  const timeWindow = input.window;

  let dateDisplayFormat = 'D MMM YYYY, HH:mm';
  if (timeWindow === '1h' || timeWindow === '6h' || timeWindow === '12h' || timeWindow === '24h') {
    dateDisplayFormat = 'HH:mm';
  }
  else if (timeWindow === '48h' || timeWindow === '1w' || timeWindow === '1mo' || timeWindow === '2mo') {
    dateDisplayFormat = 'ddd, D MMM';
  }
  return dateDisplayFormat;
}

export function calculateDateDisplayFormatForHistogram(input) {
  const timeWindow = input.window;

  let dateDisplayFormat = 'D MMM YYYY, HH:mm';
  if (timeWindow === '1h' || timeWindow === '6h' || timeWindow === '12h' || timeWindow === '24h') {
    dateDisplayFormat = 'ddd, D HH:mm';
  }
  else if (timeWindow === '48h' || timeWindow === '1w' || timeWindow === '1mo' || timeWindow === '2mo') {
    dateDisplayFormat = 'ddd, D MMM HH:mm';
  }
  return dateDisplayFormat;
}

export function formatDate(date, duration) {
  const dateDisplayFormat = calculateDateDisplayFormat(duration);
  let localTimeNew = moment.utc(date).toDate();
  return moment(localTimeNew).format(dateDisplayFormat);
}

export function validateDate(input) {
  const dateRegEx = new RegExp(DATE_REG_EX);
  return dateRegEx.test(input);
}

function isValid(type, input) {
  // if value is there but not a valid number, then return
  if (input && !isNumber(input)) return false;

  // if input is empty string set its value to 0.
  const value = input === '' ? 0 : parseInt(input, 10);

  // if type hr, then value should be between 0, 23
  if (type === 'hr') {
    if (!(value >= 0 && value <= 23)) return false;
  }
  else if (type === 'min' || type === 'sec') {   // if type min or sec, then value should be between 0, 59
    if (!(value >= 0 && value <= 59)) return false;
  }

  return true;
}

export function validateTime(input) {
  const timeArr = input.split(':'),
    [hr, min, sec] = timeArr;

  if (timeArr.length > 3) return false;
  if (hr && !isValid('hr', hr)) return false;
  if (min && !isValid('min', min)) return false;
  if (sec && !isValid('sec', sec)) return false;

  return true;
}
