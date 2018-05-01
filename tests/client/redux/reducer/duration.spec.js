import { TIME_INTERVAL_UPDATE } from 'Constants';

import durationReducer from 'redux/reducer/duration';

describe('duration Reducer', () => {
  it('should be a function.', function() {
    expect(durationReducer).to.be.a('function');
  });

  it('should set the value provide by duration object', () => {
    const state = durationReducer({}, {type: TIME_INTERVAL_UPDATE, data: {window: '1w'}});
    expect(state).to.have.a.property('window', '1w');
  });

  it('should set the value provide by duration object for start and end', () => {
    const state = durationReducer({}, { type: TIME_INTERVAL_UPDATE, data: { start: 'date1', end: 'date2' } });
    expect(state).to.have.a.property('start', 'date1');
    expect(state).to.have.a.property('end', 'date2');
  });
});
