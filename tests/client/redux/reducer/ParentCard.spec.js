import {
  REQUEST_API_DATA,
  RECEIVE_API_DATA,
  ERROR_API_DATA,
  REMOVE_COMPONENT,
  PARENT_CARD_EVENT
} from 'Constants';

import { default as parentCardReducer } from 'redux/reducer/ParentCard';

import {Map} from 'immutable';

function initState() {
  const state = Map({});
  return state;
}

function setAPIData(id, data) {
  return parentCardReducer(undefined, {
    type: RECEIVE_API_DATA,
    id,
    data
  });
}

describe('Redux Parent Card Reducer', function() {
  it('Should be a function.', function() {
    expect(parentCardReducer).to.be.a('function');
  });

  it('Should return an immutable.', function() {
    expect(parentCardReducer(undefined, {})).to.equal(initState());
  });

  it('Should initialize with empty map.', function() {
    const state = parentCardReducer(undefined, {});
    expect(state).to.equal(Map({}));
  });

  it('Should return the previous state if an action was not matched.', function() {
    let state = parentCardReducer(undefined, {});
    expect(state).to.equal(initState());

    state = parentCardReducer(state, {type: '@@@@@@@'});
    expect(state).to.equal(initState());

    const id = '1';

    state = parentCardReducer(state, {type: REQUEST_API_DATA, id});
    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'isFetching'], true);
    expect(state).to.have.deep.property([id, 'isError'], false);

    state = parentCardReducer(state, {type: '@@@@@@@'});
    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'isFetching'], true);
    expect(state).to.have.deep.property([id, 'isError'], false);
  });

  it('Should update the state with isFetching for "REQUEST_API_DATA" action.', function() {
    const id = '1',
      state = parentCardReducer(undefined, {type: REQUEST_API_DATA, id});

    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'isFetching'], true);
    expect(state).to.have.deep.property([id, 'isError'], false);
  });

  it('Should remove the api, query and make data null for "REQUEST_API_DATA" action, if already there', function() {
    const id = '1',
      data = {
        json: {},
        api: '/test',
        query: {test: 'test'}
      };

    let state = setAPIData(id, data);

    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'data']);
    expect(state).to.have.deep.property([id, 'api']);
    expect(state).to.have.deep.property([id, 'query']);

    state = parentCardReducer(undefined, {type: REQUEST_API_DATA, id});
    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'isFetching'], true);
    expect(state).to.have.deep.property([id, 'isError'], false);
    expect(state).to.not.have.deep.property([id, 'data']);
    expect(state).to.not.have.deep.property([id, 'query']);
  });

  it('Should update the state with data for "RECEIVE_API_DATA" action.', function() {
    let id = '1',
      data = { json: {}, api: '/test', query: {test: 'test'} };

    let state = setAPIData(id, data);

    expect(state).to.have.property(id);
    expect(state).to.have.deep.property([id, 'isFetching'], false);
    expect(state).to.have.deep.property([id, 'isError'], false);
    expect(state).to.have.deep.property([id, 'data']);
    expect(state).to.have.deep.property([id, 'api']);
    expect(state).to.have.deep.property([id, 'query']);

    id = '2';
    data = { json: {}, api: '/test2', query: {test: 'test2'} };

    state = parentCardReducer(state, { type: RECEIVE_API_DATA, id, data });
    expect(state).to.have.property(id);
    expect(state).to.have.deep.property([id, 'isFetching'], false);
    expect(state).to.have.deep.property([id, 'isError'], false);
    expect(state).to.have.deep.property([id, 'data']);
    expect(state).to.have.deep.property([id, 'api']);
    expect(state).to.have.deep.property([id, 'query']);
  });

  it('Should update the state with error msg for "ERROR_API_DATA" action.', function() {
    const id = '1',
      errorData = {msg: 'error'},
      state = parentCardReducer(state, {type: ERROR_API_DATA, id, errorData});

    expect(state).to.have.property(id);
    expect(state).to.have.deep.property([id, 'isFetching'], false);
    expect(state).to.have.deep.property([id, 'isError'], true);
    expect(state).to.have.deep.property([id, 'errorData']);
  });

  it('Should remove component from the state', function() {
    let id = '1',
      data = { json: {}, api: '/test', query: { test: 'test' } };

    let state = setAPIData(id, data);
    expect(state).to.have.property(id);

    state = parentCardReducer(state, { type: REMOVE_COMPONENT, id });
    expect(state).to.not.have.property(id);
  });

  context('PARENT_CARD_EVENT', function() {
    let id, data, event;
    beforeEach(function() {
      id = '1';
      data = { json: {}, api: '/test', query: { test: 'test' } };
      event = {
        type: PARENT_CARD_EVENT,
        id,
        eventData: 'test'
      };
    });

    it('Should call set eventData', function() {
      let state = setAPIData(id, data);
      expect(state).to.not.have.deep.property([id, 'eventData']);

      state = parentCardReducer(state, event);
      expect(state).to.have.deep.property([id, 'eventData']);
      expect(state).to.have.deep.property([id, 'eventData'], 'test');
    });

    it('Should return the previous state if the component does not exist', function() {
      let state = setAPIData(id, data);
      expect(state).to.not.have.deep.property([id, 'eventData']);

      const udpatedEvent = Object.assign({}, event, {id: 2}),
        updatedState = parentCardReducer(state, udpatedEvent);
      expect(state).to.equal(updatedState);
    });
  });
});
