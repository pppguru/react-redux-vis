import https from 'https';
import fetch from 'node-fetch';
import KoaRouter from 'koa-router';
import cache from 'memory-cache';
import md5 from 'md5';

import { serverBaseUrl, timeoutDuration, cacheTime } from '../../serverEnv';
import layoutRoutes from './layouts';

import timeline from '../components/Timeline';
import anomalyChart from '../components/anomalyChart';
import heatMap from '../components/HeatMap.dal';
import table from '../components/Table.dal';
import userAgent from '../components/UserAgent.dal';
import pieChart from '../components/PieChart.dal';

import {timelineApi} from '../json/api/timeline';
import {tableApi} from '../json/api/table';
import {heatMapApi} from '../json/api/heatMap';
import {userAgentApi} from '../json/api/userAgent';
import {pieChartApi} from '../json/api/pieChart';

import {getUrl} from '../utils/utils';

const router = new KoaRouter({
  prefix: '/api'
});

const agentOptions = {
  rejectUnauthorized: false
};

const agent = new https.Agent(agentOptions),
  timeout = timeoutDuration || 1000 * 60,
  cacheTimeout = cacheTime || 1000 * 60 * 5;

let token = '',
  tokenHash = '';
function getCacheKey(url, ctx) {
  if (token !== ctx.header.authorization) {
    token = ctx.header.authorization;
    tokenHash = md5(token);
  }

  return `${url}#${ctx.header['content-type']}/${tokenHash}`;
}

router
.get('/layout/*', layoutRoutes)
.get('*', async function(ctx, next) {
  const url = await getUrl(ctx),
    cacheKey = getCacheKey(url, ctx);

  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    console.log('cached result', url);
    ctx.set('content-type', cachedResult.contentType);
    ctx.status = cachedResult.status;
    ctx.statusText = cachedResult.statusText;
    ctx.body = cachedResult.body;
    return;
  }
  else {
    console.log('proxy url', url);
  }

  const res = await fetch(url,
    {
      method: 'GET',
      headers: {...ctx.headers, 'Content-Type': 'application/json'},
      timeout,
      agent
    }
  );

  let body;
  try {
    const data = await res.json();
    ctx.tempData = data;
    await next();
    body = ctx.normalizeData || data;
  }
  catch (ex) {
    const status = res.status !== 200 ? res.status : 400,
      statusText = res.status !== 200 ? res.statusText : 'api response error';

    const obj = {
      errorCode: status,
      errorMessage: statusText,
      errorDetails: ex
    };

    console.error('Api error', JSON.stringify(obj));
    ctx.throw(statusText, status);
  }

  const contentType = res.headers.get('content-type'),
    status = res.status,
    statusText = res.statusText;

  ctx.set('content-type', contentType);
  ctx.status = status;
  ctx.statusText = statusText;
  ctx.body = body;

  if (status === 200) {
    cache.put(cacheKey, {
      contentType,
      status,
      statusText,
      body
    }, cacheTimeout);
  }
});

timelineApi.forEach((api) => {
  router.get(api.path + api.reportId, timeline);
});

tableApi.forEach((api) => {
  router.get(api.path + api.reportId, table);
});

heatMapApi.forEach((api) => {
  router.get(api.path + api.reportId, heatMap);
});

userAgentApi.forEach((api) => {
  router.get(api.path + api.reportId, userAgent);
});

pieChartApi.forEach((api) => {
  router.get(api.path + api.reportId, pieChart);
});

router
.post('*', async function(ctx, next) {
  const url = serverBaseUrl + ctx.url;
  console.log('proxy url', url);
  const res = fetch(url,
    {
      method: 'POST',
      headers: ctx.headers,
      rejectUnauthorized: false,
      timeout,
      agent,
      body: JSON.stringify(ctx.request.body)
    }
  );

  await res.then(response => {
    ctx.set('content-type', response.headers.get('content-type'));
    ctx.status = response.status;
    ctx.statusText = response.statusText;
    return response.json();
  }).then(json => {
    if (url.includes('/analytics/reporting/executeById')) {
      const normalizeData = anomalyChart(json);
      if (normalizeData) {
        json.normalizeData = normalizeData;
      }
    }

    ctx.body = json;
  });
});

export default router;
