import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {fakeServer} from 'sinon';
import {
  REQUEST_LAYOUT_DATA,
  RECEIVE_LAYOUT_DATA,
  ERROR_LAYOUT_DATA,
  defaultLayoutPath
} from 'Constants';

import {
  requestPageData,
  receivePageData,
  errorPageData,
  getUrl,
  fetchLayoutData,
  fetchSearchData,
  updateRoute
} from 'actions/core';

import {baseUrl} from 'config';
import { getSearchUrl } from 'utils/utils';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('corelayout Redux Actions', () => {
  it('should return the state for REQUEST_LAYOUT_DATA action', () => {
    const id = 'testId',
      state = requestPageData(id);

    expect(state).to.be.a('object');
    expect(state).to.have.property('type', REQUEST_LAYOUT_DATA);
    expect(state).to.have.property('id', id);
  });

  it('should return the state for RECEIVE_LAYOUT_DATA action', () => {
    const id = 'testId',
      json = {'test': 'data'},
      state = receivePageData(id, json);

    expect(state).to.be.a('object');
    expect(state).to.have.property('type', RECEIVE_LAYOUT_DATA);
    expect(state).to.have.property('id', id);
    expect(state).to.have.property('data', json);
  });

  it('should return the state for ERROR_LAYOUT_DATA action', () => {
    const id = 'testId',
      errorData = {'test': 'data'},
      state = errorPageData(id, errorData);

    expect(state).to.be.a('object');
    expect(state).to.have.property('type', ERROR_LAYOUT_DATA);
    expect(state).to.have.property('id', id);
    expect(state).to.have.property('errorData', errorData);
  });

  context('getUrl function', function() {
    it('should return undefined if id passed is not a string', () => {
      let url = getUrl();
      expect(url).to.be.undefined;

      url = getUrl({});
      expect(url).to.be.undefined;

      url = getUrl(1);
      expect(url).to.be.undefined;

      url = getUrl([]);
      expect(url).to.be.undefined;
    });

    it('should return defaultLayoutPath if id passed is "/"', () => {
      const url = getUrl('/');
      expect(url).to.be.a('string');
      expect(url).to.equal(defaultLayoutPath);
    });

    it('should return first part of the path if path has params', () => {
      const id = '/asset/assetId',
        url = getUrl(id);

      expect(url).to.be.a('string');
      expect(url).to.equal(`${baseUrl}/api/layout/asset`);
    });

    it('should return path only', () => {
      const id = '/asset/assetId',
        url = getUrl(id);

      expect(url).to.be.a('string');
      expect(url).to.equal(`${baseUrl}/api/layout/asset`);
    });
  });

  context('fetchLayoutData function', function() {
    let server, auth, store;

    const json = {layout: []},
      jsonRes = JSON.stringify(json);

    beforeEach(function() {
      server = fakeServer.create();
      auth = { cookies: { access_token: '', token_type: '' } };
      store = mockStore({ auth });
    });

    afterEach(function() {
      server.restore();
    });

    it('should dispatch RECEIVE_LAYOUT_DATA with json data', () => {
      const id = '/';
      server.respondWith('GET', defaultLayoutPath, [ 200, { 'Content-Type': 'application/json' }, jsonRes ]);
      const apiObj = store.dispatch(fetchLayoutData(id))
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', REQUEST_LAYOUT_DATA);
          expect(actions[0]).to.have.a.property('id', id);

          expect(actions[1]).to.have.a.property('type', RECEIVE_LAYOUT_DATA);
          expect(actions[1]).to.have.a.property('id', id);
          expect(actions[1]).to.have.a.property('data');
          expect(actions[1].data).to.deep.equal({json});
        });

      server.respond();
      return apiObj;
    });

    it('should dispatch ERROR_LAYOUT_DATA with error "Json not loaded correctly from server"', () => {
      const id = '/';
      server.respondWith('GET', defaultLayoutPath, [ 200, { 'Content-Type': 'application/json' }, '{"layout": [],}' ]);
      const apiObj = store.dispatch(fetchLayoutData(id))
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', REQUEST_LAYOUT_DATA);
          expect(actions[0]).to.have.a.property('id', id);

          expect(actions[1]).to.have.a.property('type', ERROR_LAYOUT_DATA);
          expect(actions[1]).to.have.a.property('id', id);
          expect(actions[1]).to.have.a.property('errorData');
        });

      server.respond();
      return apiObj;
    });

    it('should dispatch ERROR_LAYOUT_DATA with error server error', () => {
      const id = '/';
      server.respondWith('GET', defaultLayoutPath, [ 400, { 'Content-Type': 'application/json' }, jsonRes ]);
      const apiObj = store.dispatch(fetchLayoutData(id))
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', REQUEST_LAYOUT_DATA);
          expect(actions[0]).to.have.a.property('id', id);

          expect(actions[1]).to.have.a.property('type', ERROR_LAYOUT_DATA);
          expect(actions[1]).to.have.a.property('id', id);
          expect(actions[1]).to.have.a.property('errorData');
        });

      server.respond();
      return apiObj;
    });
  });

  context('fetchSearchData function', function() {
    it('should call search url', () => {
      const server = fakeServer.create(),
        auth = { cookies: { access_token: '', token_type: '' } },
        json = {},
        jsonRes = JSON.stringify(json),
        query = 'hello';

      server.respondWith('GET', getSearchUrl(query), function(req) {
        const headers = req.requestHeaders;
        expect(headers).to.have.a.property('authorization');
        expect(headers.authorization).to.be.a('string');
        expect(req.url).to.equal('/api/analytics/reporting/execute/taf_search_assets?term=hello');
        req.respond(200, { 'Content-Type': 'application/json' }, jsonRes);
      });

      const apiObj = fetchSearchData(auth, query);
      server.respond();
      return apiObj;
    });
  });

  context('updateRoute function', function() {
    it('should should dispatch push for react router', () => {
      const store = mockStore({});
      store.dispatch(updateRoute('/logout'));

      const actions = store.getActions();
      expect(actions).to.have.length(1);
      expect(actions[0]).to.have.a.property('type', '@@router/CALL_HISTORY_METHOD');
    });
  });
});
