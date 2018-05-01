import {
  REQUEST_LAYOUT_DATA,
  RECEIVE_LAYOUT_DATA,
  ERROR_LAYOUT_DATA,
  defaultLayoutPath
} from 'Constants';

import {baseUrl} from 'config';
import { push } from 'react-router-redux';
import {fetchData, getSearchUrl} from 'utils/utils';

export function requestPageData(id) {
  return {
    type: REQUEST_LAYOUT_DATA,
    id
  };
}

export function receivePageData(id, json) {
  return {
    type: RECEIVE_LAYOUT_DATA,
    data: json,
    id
  };
}

export function errorPageData(id, ex) {
  return {
    type: ERROR_LAYOUT_DATA,
    errorData: ex,
    id
  };
}

export function getUrl(id) {
  if (typeof id !== 'string') return;

  const pathArr = id.split('/');
  if (id === '/') {   // if path id is / then layout id is summary-page.
    return defaultLayoutPath;
  }
  else if (pathArr.length > 2) { // if id has path params, then first part of the url is used to fetch layout json.
    id = pathArr.slice(0, 2).join('/');
  }

  return `${baseUrl}/api/layout${id}`;
}

export function fetchLayoutData(id) {
  // Thunk middleware knows how to handle functions.
  // It passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.

  return function(dispatch, getState) {
    const cookies = getState().auth.cookies;

    dispatch(requestPageData(id));
    return fetchData(getUrl(id), cookies, dispatch)
    .then(json => {
      dispatch(receivePageData(id, {json}));
    })
    .catch(ex => {
      dispatch(errorPageData(id, ex));
    });
  };
};

// TODO, update this method, and the search state in the redux.
export function fetchSearchData(auth, query) {
  const cookies = auth.cookies,
    accessToken = cookies.access_token,
    tokenType = cookies.token_type,
    authorizationHeader = {
      'Authorization': `${tokenType} ${accessToken}`
    };

  let url = getSearchUrl(query);
  return fetch(url, {
    method: 'GET',
    headers: authorizationHeader
  });
};

export function updateRoute(url) {
  return function(dispatch, getState) {
    dispatch(push(url));
  };
}
