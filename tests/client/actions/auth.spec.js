import {USER_DETAILS_LOADING, USER_DETAILS_LOADED, USER_DETAILS_ERROR, SET_COOKIES, profileUrl} from 'Constants';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {fakeServer, spy} from 'sinon';

import {
  userDetailsLoading,
  userDetailsLoaded,
  userDetailsError,
  setCookies,
  fetchUserData,
  isLoggedIn,
  logoutUtil,
  logout
} from 'actions/auth';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
describe('auth actions', () => {
  it('should return USER_DETAILS_LOADING state', () => {
    const state = userDetailsLoading();
    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', USER_DETAILS_LOADING);
  });

  it('should return USER_DETAILS_LOADED state', () => {
    const data = {test: 1},
      state = userDetailsLoaded(data);
    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', USER_DETAILS_LOADED);
    expect(state).to.have.a.property('data', data);
  });

  it('should return USER_DETAILS_ERROR state', () => {
    const errorData = {test: 1},
      state = userDetailsError(errorData);

    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', USER_DETAILS_ERROR);
    expect(state).to.have.a.property('errorData', errorData);
  });

  it('should return SET_COOKIES state', () => {
    const cookies = {test: 1},
      state = setCookies(cookies);

    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', SET_COOKIES);
    expect(state).to.have.a.property('data', cookies);
  });

  context('fetchUserData function', function() {
    let server, auth, store;

    const json = {__authDetails: {}, taf: {}},
      jsonRes = JSON.stringify(json);

    beforeEach(function() {
      server = fakeServer.create();
      auth = { cookies: { access_token: '', token_type: '' } };
      store = mockStore({ auth });
    });

    afterEach(function() {
      server.restore();
    });

    it('should call profile url and dispatch USER_DETAILS_LOADING and USER_DETAILS_LOADED events', () => {
      server.respondWith('GET', profileUrl, [ 200, { 'Content-Type': 'application/json' }, jsonRes ]);
      const apiObj = store.dispatch(fetchUserData())
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', USER_DETAILS_LOADING);

          expect(actions[1]).to.have.a.property('type', USER_DETAILS_LOADED);
          expect(actions[1]).to.have.a.property('data');
          expect(actions[1].data).to.deep.equal(json);
        });

      server.respond();
      return apiObj;
    });

    it('should call profile url, dispatch USER_DETAILS_LOADING and USER_DETAILS_ERROR events in case of error', () => {
      server.respondWith('GET', profileUrl, [ 400, { 'Content-Type': 'application/json' }, jsonRes ]);
      const apiObj = store.dispatch(fetchUserData())
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', USER_DETAILS_LOADING);
          expect(actions[1]).to.have.a.property('type', USER_DETAILS_ERROR);
          expect(actions[1]).to.have.a.property('errorData');
          expect(actions[1].data).to.be.an.object;
        });

      server.respond();
      return apiObj;
    });
  });

  context('isLoggedIn function', () => {
    let store;
    beforeEach(() => {
      store = mockStore({});
    });

    it('should return undefined, if the cookies are not set, and location does not have hash', () => {
      const location = {},
        flag = isLoggedIn(location, store);

      expect(flag).to.be.undefined;
    });

    it('should return false, if hash does not have either access_token or token_type', () => {
      let location = {hash: '#a=test'},
        flag = isLoggedIn(location, store);
      expect(flag).to.be.false;

      location = {hash: '#access_token=test'};
      flag = isLoggedIn(location, store);
      expect(flag).to.be.false;

      location = {hash: '#token_type=test'};
      flag = isLoggedIn(location, store);
      expect(flag).to.be.false;
    });

    it('should return true, if hash has access_token and token_type and should set the cookies', () => {
      let location = {hash: '#access_token=test&token_type=test'},
        flag = isLoggedIn(location, store);
      expect(flag).to.be.true;

      let actions = store.getActions();
      expect(actions).to.have.length(1);
      const action = actions[0];
      expect(action).to.have.a.property('type', SET_COOKIES);
      expect(action).to.have.a.property('data');
      expect(action.data).to.be.an.object;
    });

    it('should dispatch SET_COOKIES, when hash is not provided', () => {
      let location = {};
      isLoggedIn(location, store);

      let actions = store.getActions();
      expect(actions).to.have.length(1);

      const action = actions[0];
      expect(action).to.have.a.property('type', SET_COOKIES);
      expect(action).to.have.a.property('data');
      expect(action.data).to.be.an.object;
    });
  });

  context('logoutUtil function', () => {
    beforeEach(function() {
      this.store = mockStore({});
    });

    it('should return SET_COOKIES state, with null data', function() {
      logoutUtil(this.store.dispatch);
      const actions = this.store.getActions();
      expect(actions).to.have.length(2);

      const action = actions[0];
      expect(action).to.have.a.property('type', SET_COOKIES);
      expect(action).to.have.a.property('data');
      expect(action.data).to.be.an.null;
    });

    it('should call window.open for redirection if redirectOnTokenExpiry config variable is set', function() {
      // set config variable for window object
      window.global = {
        redirectOnTokenExpiry: '/test'
      };

      const openFn = window.open;
      window.open = spy();

      logoutUtil(this.store.dispatch);
      const actions = this.store.getActions();
      expect(actions).to.have.length(1);

      const action = actions[0];
      expect(action).to.have.a.property('type', SET_COOKIES);
      expect(action).to.have.a.property('data');
      expect(action.data).to.be.an.null;

      expect(window.open).to.be.calledOnce;

      // reverting window config
      delete window.global;
      window.open = openFn;
    });

    it('should call react router for redirection', function() {
      logoutUtil(this.store.dispatch);
      const actions = this.store.getActions();
      expect(actions).to.have.length(2);
      expect(actions[0]).to.have.a.property('type', SET_COOKIES);
      expect(actions[1]).to.have.a.property('type', '@@router/CALL_HISTORY_METHOD');
    });
  });

  context('logout function', function() {
    it('should call logoutUtil function to logout user by Setting cookies to null', function() {
      const store = mockStore({});
      store.dispatch(logout());
      const actions = store.getActions();
      expect(actions).to.have.length(2);

      const action = actions[0];
      expect(action).to.have.a.property('type', SET_COOKIES);
      expect(action).to.have.a.property('data');
      expect(action.data).to.be.an.null;
    });
  });
});
