import {
  REQUEST_DETAILS_API_DATA,
  RECEIVE_DETAILS_API_DATA,
  UPDATE_DETAILS_API_DATA,
  ERROR_DETAILS_API_DATA,
  REMOVE_DETAILS_COMPONENT
} from 'Constants';

import {Map} from 'immutable';

const initialState = Map();

function requestApi(id, state, action) {
  const { api } = action;
  const dataMap = Map({
    id,
    api,
    isFetching: true,
    isError: false
  });

  return state.set(id, dataMap);
}

function receiveApi(id, state, action) {
  const {data} = action,
    {json, api, query} = data;

  const dataMap = Map({
    id,
    isFetching: false,
    isError: false,
    data: json,
    api,
    query
  });

  return state.set(id, dataMap);
}

function updateApi(id, state, action) {
  let {data} = action,
    {json, api, query, prevData} = data;

  if (prevData) {
    prevData = Object.assign({}, prevData);
    json = Object.assign({}, json, {
      rows: prevData.rows.concat(json.rows)
    });
  }

  const dataMap = Map({
    id,
    isFetching: false,
    isError: false,
    data: json,
    api,
    query
  });

  return state.set(id, dataMap);
}

function errorApi(id, state, action) {
  const {errorData, api} = action;

  const dataMap = Map({
    id,
    isFetching: false,
    isError: true,
    errorData,
    api
  });

  return state.set(id, dataMap);
}

function apiStates(state, action, fn) {
  let {id} = action;
  id = id.split(',');

  id.forEach(currentId => {
    state = fn(currentId, state, action);
  });

  return state;
}

export default function detailsDataReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_DETAILS_API_DATA: {
      return apiStates(state, action, requestApi);
    }
    case RECEIVE_DETAILS_API_DATA: {
      return apiStates(state, action, receiveApi);
    }
    case UPDATE_DETAILS_API_DATA: {
      return apiStates(state, action, updateApi);
    }
    case ERROR_DETAILS_API_DATA: {
      return apiStates(state, action, errorApi);
    }
    case REMOVE_DETAILS_COMPONENT: {
      const {id} = action;
      return state.delete(id);
    }
    default: {
      return state;
    }
  }
}
