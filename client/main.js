import React from 'react';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
// import { createHashHistory } from 'history';
import { useRouterHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import makeRoutes from './routes';
import Root from './containers/Root';
import configureStore from './redux/configureStore';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

if (window.global && window.global.enableAnalytics) {
  require('autotrack');
}


// Configure history for react-router
const browserHistory = useRouterHistory(createBrowserHistory)({
  queryKey: false
});

// Create redux store and sync with react-router-redux. We have installed the
// react-router-redux reducer under the key "router" in client/routes/index.js,
// so we need to provide a custom `selectLocationState` to inform
// react-router-redux of its location.
const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: (state) => state.router
});

// Now that we have the Redux store, we can create our routes. We provide
// the store to the route definitions so that routes have access to it for
// hooks such as `onEnter`.
const routes = makeRoutes(store);

addLocaleData(en);
addLocaleData(de);
addLocaleData(it);
addLocaleData(es);
addLocaleData(fr);

function start() {
  // Now that redux and react-router have been configured, we can render the
  // React application to the DOM!

  ReactDOM.render(
    <Root history={history} routes={routes} store={store} />,
    document.getElementById('root')
  );
}

// All modern browsers, expect `Safari`, have implemented
// the `ECMAScript Internationalization API`.
// For that we need to patch in on runtime.
if (!global.Intl) {
  require.ensure(['intl'], (requ) => {
    requ('intl');
    start();
  }, 'IntlBundle');
}
else {
  start();
}
