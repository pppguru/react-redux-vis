import {serverBaseUrl} from '../../serverEnv';

const fs = require('fs'),
  path = require('path'),
  dalJsonDir = {
    pieChart: []
  };

export const readFileThunk = function(src) {
  return new Promise(function(resolve, reject) {
    fs.readFile(src, {}, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

export async function readDir(dir) {
  const readDirThunk = function(dirName) {
    const dirPath = path.join(__dirname, '../json/' + dirName);
    return new Promise(function(resolve, reject) {
      fs.readdir(dirPath, {}, function(err, data) {
        if (err) return reject(err);
        dalJsonDir[dirName] = data;
      });
    });
  };
  await readDirThunk(dir);
};

export function getDalJsonFileNamesOnce() {
  for (let dir in dalJsonDir) {
    readDir(dir);
  }
}

getDalJsonFileNamesOnce();

export async function getUrl(ctx) {
  let url = serverBaseUrl + ctx.url;

  // This 'if' condition is added becasue it replaces the report id only if we used 'dash_' reportId.
  // For example: in piechart, we need more than one taf report ids,
  // and it is not good to give dal json file name as all these taf reportids.
  // Hence, for pie chart, we have created dal jsons names starting with 'dash_' word.
  // So, while calling the proxy URL, we needed to replace that dash report id with taf report id.
  // So, for this reason, I have created this function.
  if (url.includes('dash_')) {
    for (let dirName in dalJsonDir) {
      let files = dalJsonDir[dirName],
        filePath = '',
        dashReportId = '';
      files.every(function(file, index) { // here I have used 'every' since I wanted to break the loop.
        file = file.split('/');
        dashReportId = file[file.length - 1];
        dashReportId = dashReportId.replace('.json', '');
        if (url.includes(dashReportId)) {
          let fileName = `../json/${dirName}/${dashReportId}.json`;
          filePath = path.join(__dirname, fileName);
          return false;
        }
        else {
          return true;
        }
      });
      if (filePath !== '') {
        let dataJson = await readFileThunk(filePath);
        dataJson = JSON.parse(dataJson.toString());
        const tafReportId = dataJson.meta && dataJson.meta.api ? dataJson.meta.api.reportId : '';
        url = url.replace(dashReportId, tafReportId);
      }
    }
  }

  return url;
}
