import {
  REQUEST_ACTIONS_LIST,
  RECEIVE_ACTIONS_LIST,
  ERROR_ACTIONS_LIST,
  actionsUrl
} from 'Constants';

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {fakeServer} from 'sinon';

import {
  actionsListRequest,
  actionsListRecieve,
  actionsListError,
  fetchActionsList
} from 'actions/actionsList';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
describe('actionsList actions', () => {
  it('should return REQUEST_ACTIONS_LIST state', () => {
    const state = actionsListRequest();
    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', REQUEST_ACTIONS_LIST);
  });

  it('should return RECEIVE_ACTIONS_LIST state', () => {
    const data = {test: 1},
      state = actionsListRecieve(data);
    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', RECEIVE_ACTIONS_LIST);
    expect(state).to.have.a.property('data', data);
  });

  it('should return ERROR_ACTIONS_LIST state', () => {
    const errorData = {test: 1},
      state = actionsListError(errorData);

    expect(state).to.be.an.object;
    expect(state).to.have.a.property('type', ERROR_ACTIONS_LIST);
    expect(state).to.have.a.property('errorData', errorData);
  });

  context('fetchActionsList function', function() {
    let server, auth, store;

    const json = {rows: [], columns: []},
      jsonRes = JSON.stringify(json);

    beforeEach(function() {
      server = fakeServer.create();
      auth = { cookies: { access_token: '', token_type: '' } };
      store = mockStore({ auth });
    });

    afterEach(function() {
      server.restore();
    });

    it('should call actionsUrl and dispatch REQUEST_ACTIONS_LIST and RECEIVE_ACTIONS_LIST events for 200 response', () => {
      server.respondWith('GET', actionsUrl, [ 200, { 'Content-Type': 'application/json' }, jsonRes ]);
      const apiObj = store.dispatch(fetchActionsList())
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', REQUEST_ACTIONS_LIST);

          expect(actions[1]).to.have.a.property('type', RECEIVE_ACTIONS_LIST);
          expect(actions[1]).to.have.a.property('data');
          expect(actions[1].data).to.deep.equal(json);
        });

      server.respond();
      return apiObj;
    });

    it('should call actionsUrl, dispatch REQUEST_ACTIONS_LIST and ERROR_ACTIONS_LIST events in case of error', () => {
      server.respondWith('GET', actionsUrl, [ 400, { 'Content-Type': 'application/json' }, jsonRes ]);
      const apiObj = store.dispatch(fetchActionsList())
        .then(res => {
          const actions = store.getActions();
          expect(actions).to.have.length(2);
          expect(actions[0]).to.have.a.property('type', REQUEST_ACTIONS_LIST);
          expect(actions[1]).to.have.a.property('type', ERROR_ACTIONS_LIST);
          expect(actions[1]).to.have.a.property('errorData');
          expect(actions[1].data).to.be.an.object;
        });

      server.respond();
      return apiObj;
    });
  });
});
