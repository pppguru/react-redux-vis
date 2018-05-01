import https from 'https';
import fetch from 'node-fetch';
import {serverBaseUrl} from '../../serverEnv';
import {readFileThunk} from '../utils/utils';

const path = require('path');

const agent = new https.Agent({ rejectUnauthorized: false });
export default async function layoutRoutes(ctx, next) {
  const reqPath = ctx.request.path;
  const layoutPath = reqPath.split('/')[3];

  // First try and get layout json from the server,
  // if it fails then use the local layout json file
  try {
    if (process.env.NODE_ENV !== 'development') {
      const response = await fetch(serverBaseUrl + `/api/store/dashboard/${layoutPath}`,
        {
          method: 'GET',
          headers: ctx.headers,
          agent
        }
      );

      const data = await response.json();
      if (data.errorCode) {
        throw new Error({msg: 'Use the local files if result fails'});
      }
      ctx.set('Content-Type', 'application/json; charset=UTF-8');
      ctx.body = data;
    }
    else {
      throw new Error({msg: 'Use the local files in case of development'});
    }
  }
  catch (ex) {
    try {
      const fileName = `../json/${layoutPath}.json`,
        filePath = path.join(__dirname, fileName);

      console.log('filePath', filePath);
      const body = await readFileThunk(filePath);
      ctx.set('Content-Type', 'application/json; charset=UTF-8');
      ctx.body = body;
    }
    catch (ex) {
      ctx.status = 404;
      ctx.message = 'Layout not found';
      ctx.body = {
        'timeStamp': (new Date()).getTime(),
        'errorCode': 404,
        'details': 'Layout not found'
      };
    }
  }
}
