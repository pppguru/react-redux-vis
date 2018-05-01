import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import locale from './reducer/locale';
import auth from './reducer/auth';
import layout from './reducer/core';
import parentCard from './reducer/ParentCard';
import details from './reducer/details';
import actionsList from './reducer/actionsList';
import duration from './reducer/duration';

export default combineReducers({
  auth,
  router,
  locale,
  apiData: parentCard,
  details,
  layout,
  actions: actionsList,
  duration
});
