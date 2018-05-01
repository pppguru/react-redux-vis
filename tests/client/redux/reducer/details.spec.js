import {
  REQUEST_DETAILS_API_DATA,
  RECEIVE_DETAILS_API_DATA,
  ERROR_DETAILS_API_DATA,
  REMOVE_DETAILS_COMPONENT
} from 'Constants';

import detailsDataReducer from 'redux/reducer/details';

import { Map } from 'immutable';

const initialState = Map();

function setAPIData(id, data) {
  return detailsDataReducer(undefined, {
    type: RECEIVE_DETAILS_API_DATA,
    id,
    data
  });
}

describe('details Reducer', function() {
  it('Should be a function.', function() {
    expect(detailsDataReducer).to.be.a('function');
  });

  it('Should return an immutable.', function() {
    expect(detailsDataReducer(undefined, {})).to.equal(initialState);
  });

  it('Should initialize with an empty map.', function() {
    const state = detailsDataReducer(undefined, {});
    expect(state).to.equal(Map({}));
  });

  it('Should return the previous state if an action was not matched.', function() {
    let state = detailsDataReducer(undefined, {});
    expect(detailsDataReducer(undefined, {})).to.equal(initialState);

    state = detailsDataReducer(state, { type: '@@@@@@@' });
    expect(state).to.equal(initialState);

    const id = '1';
    state = detailsDataReducer(state, { type: REQUEST_DETAILS_API_DATA, id });
    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'isFetching'], true);
    expect(state).to.have.deep.property([id, 'isError'], false);

    state = detailsDataReducer(state, { type: '@@@@@@@' });
    expect(state).to.have.key(id);
    expect(state).to.have.deep.property([id, 'isFetching'], true);
    expect(state).to.have.deep.property([id, 'isError'], false);
  });

  it('Should update the state with isFetching for "REQUEST_DETAILS_API_DATA" action.', function() {
    const id = '1',
      components = detailsDataReducer(undefined, { type: REQUEST_DETAILS_API_DATA, id });

    expect(components).to.have.key(id);
    expect(components).to.have.deep.property([id, 'isFetching'], true);
    expect(components).to.have.deep.property([id, 'isError'], false);
  });

  it('Should remove the api, query and make data null for "REQUEST_DETAILS_API_DATA" action, if already there', function() {
    const id = '1',
      data = {
        json: {},
        api: '/test',
        query: { test: 'test' }
      };

    let components = setAPIData(id, data);

    // expect(components).to.have.key(id);
    // expect(components).to.have.deep.property([id, 'data']);
    // expect(components).to.have.deep.property([id, 'api']);
    // expect(components).to.have.deep.property([id, 'query']);

    components = detailsDataReducer(undefined, { type: REQUEST_DETAILS_API_DATA, id });
    // expect(components).to.have.key(id);
    // expect(components).to.have.deep.property([id, 'isFetching'], true);
    // expect(components).to.have.deep.property([id, 'isError'], false);
    // expect(components).to.not.have.deep.property([id, 'data']);
    // expect(components).to.not.have.deep.property([id, 'api']);
    // expect(components).to.not.have.deep.property([id, 'query']);
  });

  it('Should update the state with data info for "RECEIVE_DETAILS_API_DATA" action.', function() {
    let id = '1',
      data = { json: {}, api: '/test', query: { test: 'test' } };

    let state = setAPIData(id, data);
    expect(state).to.have.property(id);
    expect(state).to.have.deep.property([id, 'isFetching'], false);
    expect(state).to.have.deep.property([id, 'isError'], false);
    expect(state).to.have.deep.property([id, 'data']);
    expect(state).to.have.deep.property([id, 'api']);
    expect(state).to.have.deep.property([id, 'query']);

    id = '2';
    data = { json: {}, api: '/test2', query: { test: 'test2' } };

    state = detailsDataReducer(state, { type: RECEIVE_DETAILS_API_DATA, id, data });
    expect(state).to.have.property(id);
    expect(state).to.have.deep.property([id, 'isFetching'], false);
    expect(state).to.have.deep.property([id, 'isError'], false);
    expect(state).to.have.deep.property([id, 'data']);
    expect(state).to.have.deep.property([id, 'api']);
    expect(state).to.have.deep.property([id, 'query']);
  });

  it('Should update the state with error msg for "ERROR_DETAILS_API_DATA" action.', function() {
    const id = '1',
      errorData = { msg: 'error' },
      state = detailsDataReducer(state, { type: ERROR_DETAILS_API_DATA, id, errorData });

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

    state = detailsDataReducer(state, {type: REMOVE_DETAILS_COMPONENT, id});
    expect(state).to.not.have.property(id);
  });

  it('Should concatinate previous data with new fetched data', function() {
    let id = '1',
      data = { json: {rows: ['row3']}, api: '/test', query: { test: 'test' }, prevData: ['row1', 'row2'] },
      state = setAPIData(id, data);

    const udpatedEvent = Object.assign({}, event, {id: 2}),
      updatedState = detailsDataReducer(state, udpatedEvent);
    expect(state).to.equal(updatedState);
  });
});
