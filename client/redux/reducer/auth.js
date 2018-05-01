import {
  USER_DETAILS_LOADING,
  USER_DETAILS_LOADED,
  USER_DETAILS_ERROR,
  SET_COOKIES
} from 'Constants';

const initialState = {
  isLoading: true,
  isError: false,
  sidebar: []
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case USER_DETAILS_LOADING: {
      return Object.assign({}, state, {
        isLoading: true,
        isError: false
      });
    }
    case USER_DETAILS_LOADED: {
      const {__authDetails: {application, roles, user}, taf: {sidebar}} = action.data;

      return Object.assign({}, state, {
        application,
        roles,
        user,
        sidebar,
        isLoading: false,
        isError: false
      });
    }
    case USER_DETAILS_ERROR: {
      return Object.assign({}, state, {
        isLoading: false,
        isError: true,
        errorData: action.errorData
      });
    }
    case SET_COOKIES: {
      return Object.assign({}, state, {cookies: action.data});
    }
    default:
      return state;
  }
};
