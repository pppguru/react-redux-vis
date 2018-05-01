import {logoutUtil} from '../actions/auth';
import { NUMBER_REG_EX } from 'Constants';

export function fetchData(url, cookies, dispatch) {
  let accessToken = cookies.access_token,
    tokenType = cookies.token_type,
    authorizationHeader = {
      'Authorization': `${tokenType} ${accessToken}`
    };

  return fetch(url, {
    method: 'GET',
    headers: authorizationHeader
  })
  .then(res => {
    if (res.status === 401) {   // if auth token expires, logout.
      logoutUtil(dispatch);
    }
    else if (!res.ok) {
      throw new Error({data: res.json()});
    }

    return res.json();
  });
}

export function getSearchUrl(query) {
  return `/api/analytics/reporting/execute/taf_search_assets?term=${encodeURIComponent(query)}`;
};

export function parseQuery(qstr) {
  const query = {},
    arr = qstr.split('&');

  arr.forEach(val => {
    const b = val.split('=');
    query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
  });

  return query;
}

export function getPosition(el) {
  // yay readability
  let lx = 0, ly = 0;
  for (lx = 0, ly = 0;
    el != null;
    lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
  return {x: lx, y: ly};
}

export function autoScrollTo(id, decreasePositionBy) {
  let position = getPosition(document.getElementById(id));
  window.scrollTo(0, position.y - decreasePositionBy);
}

export function getQueryParamsForDetails(fields, dataObj) {
  let parameters = Object.assign({}, fields);

  if (dataObj.toolText) {
    let toolTexts = dataObj.toolText.split(' |');
    for (let parameter in parameters) {
      let value = toolTexts[parameters[parameter].toolTextIndex];
      if (parameter === 'date') {
        value = new Date(value).toISOString();
        value = value.replace('Z', '');
      }
      parameters[parameter].value = value;
    }
  }
  else if (dataObj.shortLabel) {
    for (let parameter in parameters) {
      parameters[parameter].value = dataObj.shortLabel;
    }
  }
  else if (dataObj.tableRow) {
    const tableRow = {...dataObj.tableRow};
    for (let p in parameters) {
      const parameter = parameters[p],
        key = parameter.key;

      if (key) {
        try {
          let value = tableRow;
          key.forEach(k => {
            value = value[k];
          });
          parameter.value = value;
        }
        catch (ex) {
          parameter.value = '';
        }
      }
    }
  }
  return parameters;
}

export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export function hideBodyScroll() {
  // hides the scroll from the body element when details are shown.
  document.body.style.overflow = 'hidden';
}

export function showBodyScroll() {
  // hides the scroll from the body element when details are shown.
  document.body.style.overflow = '';
}

export function isNumber(input) {
  const numRegX = new RegExp(NUMBER_REG_EX);
  return numRegX.test(input);
}
