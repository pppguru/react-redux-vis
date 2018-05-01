import {
  REQUEST_ACTIONS_LIST,
  RECEIVE_ACTIONS_LIST,
  ERROR_ACTIONS_LIST
} from 'Constants';

const initialState = {
  isLoading: true,
  isError: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REQUEST_ACTIONS_LIST: {
      return {
        isLoading: true,
        isError: false
      };
    }
    case RECEIVE_ACTIONS_LIST: {
      return {
        list: action.data,
        isLoading: false,
        isError: false
      };
    }
    case ERROR_ACTIONS_LIST: {
      return {
        isLoading: false,
        isError: true,
        errorData: action.errorData
      };
    }
    default:
      return state;
  }
};
