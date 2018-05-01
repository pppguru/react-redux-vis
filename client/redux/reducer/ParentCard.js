import {
  REQUEST_API_DATA,
  RECEIVE_API_DATA,
  ERROR_API_DATA,
  PARENT_CARD_EVENT,
  REMOVE_COMPONENT
} from 'Constants';

import {Map} from 'immutable';

const initialState = Map();

function requestApi(id, state, action) {
  const {api} = action;
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

export default function APIDataReducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_API_DATA: {
      return apiStates(state, action, requestApi);
    }
    case RECEIVE_API_DATA: {
      return apiStates(state, action, receiveApi);
    }
    case ERROR_API_DATA: {
      return apiStates(state, action, errorApi);
    }
    case REMOVE_COMPONENT: {
      const {id} = action;
      return state.delete(id);
    }
    case PARENT_CARD_EVENT: {
      const {id, eventData} = action;

      if (state.has(id)) {
        return state.update(id, value => {
          const newValue = value.set('eventData', eventData);
          return newValue;
        });
      }
      return state;
    }
    default: {
      return state;
    }
  }
}
