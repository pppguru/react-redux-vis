import {
  REQUEST_API_DATA,
  RECEIVE_API_DATA,
  ERROR_API_DATA,
  TIME_INTERVAL_UPDATE,
  PARENT_CARD_EVENT,
  REMOVE_COMPONENT,
  REQUEST_DETAILS_API_DATA,
  RECEIVE_DETAILS_API_DATA,
  UPDATE_DETAILS_API_DATA,
  ERROR_DETAILS_API_DATA,
  REMOVE_DETAILS_COMPONENT
} from 'Constants';

import {baseUrl} from 'config';
import {logoutUtil} from './auth';

let cookies = {};

export function requestApiData(id, api, isDetails) {
  if (isDetails) {
    return { type: REQUEST_DETAILS_API_DATA, id, api };
  }
  else {
    return { type: REQUEST_API_DATA, id, api };
  }
}

export function receiveApiData(id, data, isDetails) {
  if (isDetails) {
    return { type: RECEIVE_DETAILS_API_DATA, data, id };
  }
  else {
    return { type: RECEIVE_API_DATA, data, id };
  }
}

export function updateDetailsApiData(id, data) {
  return { type: UPDATE_DETAILS_API_DATA, data, id };
}

export function errorApiData(id, errorData, api, isDetails) {
  if (isDetails) {
    return { type: ERROR_DETAILS_API_DATA, errorData, id, api };
  }
  else {
    return { type: ERROR_API_DATA, errorData, id, api };
  }
}

export function changeTimeRange(timeRange) {
  let duration = timeRange;
  if (!timeRange.start) {
    duration = {window: duration};
  };
  return {
    type: TIME_INTERVAL_UPDATE,
    data: duration
  };
}

export function componentEvent(id, eventData) {
  return {
    type: PARENT_CARD_EVENT,
    id,
    eventData
  };
}

export function removeComponentWithId(id) {
  return [{ type: REMOVE_COMPONENT, id }, { type: REMOVE_DETAILS_COMPONENT, id }];
}

function getQuery(key) {
  if (key === 'offset') {
    // Get current timezone offset for host device
    const temp = new Date();
    return temp.getTimezoneOffset();
  }

  return '';
}

export function getUrl(api, duration = '1h', routerParams) {
  const {queryParams: query, path, pathParams} = api;

  if (!query || !path || !pathParams) {
    return '';
  }

  let url = path;

  const pathKeys = Object.keys(pathParams);

  pathKeys.forEach(key => {
    let templateString = `{${key}}`;

    const param = pathParams[key];
    // if param is :pathParam, it implies use path param of the current url.
    if (url) {
      if (param.startsWith(':pathParam')) {
        url = url.replace(templateString, routerParams[key]);
      }
      else {
        url = url.replace(templateString, pathParams[key]);
      }
    }
  });

  const keys = Object.keys(query);
  let queryString = '';

  if (keys.length > 0) {
    queryString += '?';

    keys.forEach(key => {
      let queryKey = key;
      if (key.endsWith(':pathParam')) {
        queryKey = key.substr(0, key.indexOf(':pathParam'));
        queryKey = routerParams[queryKey];
      }

      if ((key === 'window' || key === 'timeShift') && (query[key] === '')) {
        if (duration.start) {
          const {start, end} = duration;
          // if query string already contains start and end value, then don't add those again.
          if (!(queryString.includes('start=') || queryString.includes('end='))) {
            queryString += `start=${encodeURI(start)}&end=${encodeURI(end)}&`;
          }
        }
        else {
          queryString += `${queryKey}=${encodeURI(duration.window)}&`;
        }
      }
      // if query value is :customParam, then it is unique case and handled differently for everycase.
      else if (('' + query[key]).endsWith(':customParam')) {
        queryString += `${queryKey}=${encodeURI(getQuery(key))}&`;
      }
      // if query value is :pathParam, it implies use path param of the current url.
      else if (('' + query[key]).endsWith(':pathParam')) {
        // query[key] = 'user:pathParam', it will extract user from.
        const paramKey = query[key].substr(0, query[key].indexOf(':pathParam'));
        queryString += `${queryKey}=${encodeURI(routerParams[paramKey])}&`;
      }
      else {
        queryString += `${queryKey}=${encodeURI(query[key])}&`;
      }
    });

    queryString = queryString.slice(0, queryString.length - 1);
  }

  return baseUrl + url + queryString;
}

export function callApi(api, duration, params, options, dispatch) {
  const accessToken = cookies.access_token,
    tokenType = cookies.token_type,
    headers = (api && api.headers) || {},
    defaultHeaders = Object.assign({
      'Authorization': `${tokenType} ${accessToken}`,
      'Content-Type': 'application/json'
    }, headers),
    body = options && JSON.stringify(options.body);

  const url = getUrl(api, duration, params);

  return fetch(url, {
    method: api.method || 'GET',
    headers: defaultHeaders,
    body
  })
  .then(response => {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    }
    else if (response.status === 401) {
      logoutUtil(dispatch);
    }
    else {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  });
}

export function fetchApiData(input) {
  const {id, api, params, options, isDetails} = input;
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function(dispatch, getState) {
    const currentDuration = getState().duration;

    cookies = getState().auth.cookies;
    dispatch(requestApiData(id, api, isDetails));

    if (Array.isArray(api)) {
      const arr = api.map(apiObj => callApi(apiObj, currentDuration, params, options, dispatch));

      return Promise.all(arr)
      .then(results => {
        const json = {};

        results.forEach((val, index) => {
          const apiId = api[index].id;
          json[apiId] = val;
          json[apiId].options = options;
        });

        dispatch(receiveApiData(id, {json, api}, isDetails));
      })
      .catch(ex => {
        dispatch(errorApiData(id, ex, api, isDetails));
      });
    }
    else {
      return callApi(api, currentDuration, params, options, dispatch)
      .then(json => {
        json.options = options;
        dispatch(receiveApiData(id, {json, api}, isDetails));
      })
      .catch(ex => {
        dispatch(errorApiData(id, ex, api, isDetails));
      });
    }
  };
}

// This function is used to fetch next set of data for server side pagination
export function fetchNextSetOfData(apiObj, prevData) {
  return function(dispatch, getState) {
    const {id, api, params, options, isDetails} = apiObj,
      currentDuration = getState().duration;

    dispatch(requestApiData(id, api, isDetails));

    return callApi(api, currentDuration, params, options, dispatch)
    .then(json => {
      json.options = options;
      dispatch(updateDetailsApiData(id, {json, api, prevData}));
    })
    .catch(ex => {
      dispatch(errorApiData(id, ex, api, isDetails));
    });
  };
}

// Update api data for all the components that are visible on the page
// when time range is changed.
export function updateApiData(newDuration, params) {
  return function(dispatch, getState) {
    const {apiData, details, duration} = getState();
    const currentDuration = duration,
      isParamUpdate = newDuration.param && (currentDuration.window !== newDuration.param),
      isRangeUpdate = newDuration.start &&
                        (currentDuration.start !== newDuration.start || currentDuration.end !== newDuration.end);

    if (isParamUpdate || isRangeUpdate) {
      if (isParamUpdate) {
        dispatch(changeTimeRange(newDuration.param));
      }
      else {
        dispatch(changeTimeRange({start: newDuration.start, end: newDuration.end}));
      }

      if (apiData) {
        const components = apiData;
        components.forEach(component => {
          const id = component.get('id');
          const api = component.get('api');
          const options = component.get('data') && component.get('data').options;

          // this is the case if one api serves the data for multiple element
          // therefore on time duration update there are multiple calls for the api request.
          if (api && api.loadOnce) {
            return;
          }

          fetchApiData({id, api, params, options, isDetails: false})(dispatch, getState);
        });
      }

      if (details) {
        details.forEach(component => {
          const id = component.get('id');
          const api = component.get('api');
          const options = component.get('data') && component.get('data').options;

          delete api.queryParams.end;
          delete api.queryParams.start;
          if (api.queryParams.from) {
            delete api.queryParams.from;
          }
          api.queryParams.window = '';
          fetchApiData({id, api, params, options, isDetails: true})(dispatch, getState);
        });
      }
    }
  };
}

export function broadcastEvent(id, eventData) {
  return function(dispatch, getState) {
    const {apiData} = getState();

    if (apiData) {
      const components = apiData;

      components.forEach(component => {
        const componentId = component.get('id');
        if (componentId === id) {
          dispatch(componentEvent(id, eventData));
        }
      });
    }
  };
}

export function removeComponent(id) {
  return function(dispatch) {
    removeComponentWithId(id).forEach(component => {
      dispatch(component);
    });
  };
}
