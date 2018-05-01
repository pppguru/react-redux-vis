import {
  REQUEST_LAYOUT_DATA,
  RECEIVE_LAYOUT_DATA,
  ERROR_LAYOUT_DATA
} from 'Constants';

import {
  default as coreReducer
} from 'redux/reducer/core';

import {fromJS} from 'immutable';

function initState(id, initState) {
  let state = coreReducer(initState, {
    type: REQUEST_LAYOUT_DATA,
    id
  });

  return state;
}

function setLayoutData(id, data) {
  let state = initState(id);

  state = coreReducer(state, {
    type: RECEIVE_LAYOUT_DATA,
    id,
    data
  });

  return state;
}

describe('Redux Core Reducer', function() {
  it('Should be a function.', function() {
    expect(coreReducer).to.be.a('function');
  });

  it('Should return an immutable.', function() {
    expect(coreReducer(undefined, {})).to.equal(fromJS({}));
  });

  it('Should initialize with a state of empty Immutable map.', function() {
    expect(coreReducer(undefined, {})).to.equal(fromJS({}));
  });

  it('Should return the previous state if an action was not matched.', function() {
    let state = coreReducer(undefined, {});
    expect(coreReducer(undefined, {})).to.equal(fromJS({}));

    state = coreReducer(state, {type: '@@@@@@@'});
    expect(coreReducer(undefined, {})).to.equal(fromJS({}));

    const id = '1';
    state = initState(id);
    expect(state).to.have.key(id);
    expect(state.get(id)).to.have.property('isFetching', true);
    expect(state.get(id)).to.have.property('isError', false);

    state = coreReducer(state, {type: '@@@@@@@'});
    expect(state).to.have.key(id);
    expect(state.get(id)).to.have.property('isFetching', true);
    expect(state.get(id)).to.have.property('isError', false);
  });

  it('Should update the state with isFetching for "REQUEST_LAYOUT_DATA" action.', function() {
    const id = '1',
      state = initState(id);

    expect(state).to.have.key(id);
    expect(state.get(id)).to.have.property('isFetching', true);
    expect(state.get(id)).to.have.property('isError', false);
  });

  it('Should reset the layout to empty array for "REQUEST_LAYOUT_DATA" action, if already there', function() {
    const id = '1',
      data = {json: {layout: [[{dummy: 'data'}]]}};

    let state = setLayoutData(id, data);
    state = initState(id, state);
    expect(state).to.have.key(id);
    expect(state.get(id)).to.have.property('isFetching', true);
    expect(state.get(id)).to.have.property('isError', false);
    expect(state.get(id)['layout']).to.be.empty;
    expect(state.get(id)['errorData']).to.be.empty;
  });

  it('Should update the state with layout info for "RECEIVE_LAYOUT_DATA" action.', function() {
    const id = '1',
      data = {json: {layout: [[{dummy: 'data'}]]}},
      state = setLayoutData(id, data);

    expect(state).to.have.key(id);
    expect(state.get(id)).to.have.property('isFetching', false);
    expect(state.get(id)).to.have.property('isError', false);
    expect(state.get(id)['layout']).to.eql([[{dummy: 'data'}]]);
    expect(state.get(id)).to.have.property('errorData', null);
  });

  it('Should update the state with error msg for "ERROR_LAYOUT_DATA" action.', function() {
    const id = '1',
      errorData = {msg: 'error'},
      state = coreReducer(undefined, {
        type: ERROR_LAYOUT_DATA,
        id,
        errorData
      });

    expect(state).to.have.key(id);
  });

  context('Location Change Action', function() {
    it('should do nothing if state has no layouts', function() {
      const state = coreReducer(undefined, {
        type: '@@router/LOCATION_CHANGE',
        payload: {pathname: '/alerts'}
      });

      expect(state).to.be.empty;
    });

    it('should do nothing if the saved layout id is same as the payload', function() {
      const id = '/alerts',
        data = { json: { layout: [[{ dummy: 'data' }]] } };

      let state = setLayoutData(id, data);
      expect(state).to.have.key(id);

      state = coreReducer(state, {
        type: '@@router/LOCATION_CHANGE',
        payload: { pathname: '/alerts' }
      });

      expect(state).to.have.key(id);
    });

    it('should do remove saved layouts if id is not same as the payload', function() {
      const id = '/alerts',
        data = { json: { layout: [[{ dummy: 'data' }]] } };

      let state = setLayoutData(id, data);
      expect(state).to.have.key(id);

      state = coreReducer(state, {
        type: '@@router/LOCATION_CHANGE',
        payload: { pathname: '/test' }
      });

      expect(state).to.be.empty;
    });
  });
});
