import {
  REQUEST_LAYOUT_DATA,
  RECEIVE_LAYOUT_DATA,
  ERROR_LAYOUT_DATA
} from 'Constants';

import {Map} from 'immutable';

const initialState = Map();

function addLayout(state, layout) {
  return state.set(layout.id, layout);
}

function deleteLayout(state, id) {
  return state.delete(id, state.get(id));
}

function removeOtherLayouts(state, payload) {
  const id = payload.pathname;

  let newState = state;
  state.forEach(component => {
    if (component.id !== id) {
      newState = deleteLayout(state, component.id);
    }
  });

  return newState;
}

export default function PageDataReducer(state = initialState, action) {
  const actionType = action.type;
  switch (actionType) {
    case REQUEST_LAYOUT_DATA: {
      const {id} = action;

      const dataMap = {
        id,
        isFetching: true,
        isError: false
      };

      return addLayout(state, dataMap);
    }
    case RECEIVE_LAYOUT_DATA: {
      const {id, data} = action;
      const dataMap = {
        id,
        isFetching: false,
        isError: false,
        layout: data.json.layout,
        errorData: null
      };

      return addLayout(state, dataMap);
    }
    case ERROR_LAYOUT_DATA: {
      const {id, errorData} = action;

      const dataMap = {
        id,
        isFetching: false,
        isError: true,
        errorData: errorData
      };

      return addLayout(state, dataMap);
    }
    // remove other layouts when route changes
    case '@@router/LOCATION_CHANGE': {
      return removeOtherLayouts(state, action.payload);
    }
    default: {
      return state;
    }
  }
}
