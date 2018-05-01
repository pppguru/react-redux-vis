import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import CoreLayout from 'layouts/CoreLayout';
import NonLoggedLayout from 'layouts/NonLoggedLayout';

import {isLoggedIn} from 'actions/auth';

const defaultRoutes = [
  {to: 'alerts'},
  {to: 'alert/:alertId/:date'},
  {to: 'country'},
  {to: 'traffic'},
  {to: 'assets'},
  {to: 'asset/:type/:assetId'},
  {to: 'user-agent'},
  {to: 'notable-events'},
  {to: 'sysmon'},
  {to: 's3'},
  {to: 'aws'},
  {to: 'ec2'},
  {to: 'iam'}
];

function getRoutes() {
  let routes = defaultRoutes;
  if (window.global && window.global.routes) {
    routes = window.global.routes;
  }
  return routes.map((r, i) => (
    <Route path={r.to} key={`route${i}`} />
  ));
}

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    if (!isLoggedIn(nextState.location, store)) {
      replace('/login');
    }

    cb();
  };

  return (
    <Route path='/' >
      <Route path='login' component={NonLoggedLayout} />

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin} component={CoreLayout}>
        <Redirect from='loggedIn' to='/' />
        <IndexRoute />
        {getRoutes()}
      </Route>

      { /* Catch all route */ }
      <Redirect path='*' to='/' component={NonLoggedLayout} />
    </Route>
  );
};
