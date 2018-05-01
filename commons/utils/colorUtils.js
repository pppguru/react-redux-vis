import { Colors, Alerts } from '../colors';

export function getColor(score, severity) {
  let color = '';
  score = score || '';
  severity = severity || '';

  if ((score !== '' && score >= 65) || severity.toLowerCase() === 'high') {
    color = Alerts.high;
  }
  else if ((score !== '' && score < 65 && score >= 35) || severity.toLowerCase() === 'medium') {
    color = Alerts.medium;
  }
  else if ((score !== '' && score < 35) || severity.toLowerCase() === 'low') {
    color = Alerts.low;
  }
  else {
    color = Alerts.default;
  }
  return color;
}

export function getColorRanges(secureConnectionsValues, maliciousConnectionsValues) {
  const secureColors = Colors.worldmap.secure,
    maliciousColors = Colors.worldmap.malicious;

  let secureMaxValue = Math.max.apply(Math, secureConnectionsValues),
    maliciousMaxValue = Math.max.apply(Math, maliciousConnectionsValues),
    secureMidValue = parseInt(secureMaxValue / 6) + 1,
    maliciousMidValue = parseInt(maliciousMaxValue / 6) + 1,
    minSecureRange = 1,
    minMaliciousRange = 1,
    colorIndex = 5,
    secureColorRanges = [],
    maliciousColorRanges = [];

  for (let m = 0; m < 6; m++) {
    let tempColorObj = {};
    if (m === 0) {
      tempColorObj.min = minSecureRange;
    }
    else {
      tempColorObj.min = minSecureRange + 1;
    }
    tempColorObj.max = minSecureRange + secureMidValue;
    minSecureRange = tempColorObj.max;
    tempColorObj.color = secureColors[colorIndex];
    secureColorRanges.push(tempColorObj);

    tempColorObj = {};
    if (m === 0) {
      tempColorObj.min = minMaliciousRange;
    }
    else {
      tempColorObj.min = minMaliciousRange + 1;
    }
    tempColorObj.max = minMaliciousRange + maliciousMidValue;
    minMaliciousRange = tempColorObj.max;
    tempColorObj.color = maliciousColors[colorIndex];
    maliciousColorRanges.push(tempColorObj);

    colorIndex--;
  }
  return {
    secure: secureColorRanges,
    malicious: maliciousColorRanges
  };
}
