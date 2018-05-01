import { TIME_INTERVAL_UPDATE } from 'Constants';

const savedDuration = window.localStorage.rankDuration;
let duration;

if (savedDuration && savedDuration !== 'undefined') {
  try {
    duration = JSON.parse(savedDuration);
  }
  catch (ex) {
    console.log('duration exception', ex);
    duration = { window: '1h' };
  }
}
else {
  duration = { window: '1h' };
}

export default function APIDataReducer(state = duration, action) {
  switch (action.type) {
    case TIME_INTERVAL_UPDATE: {
      const {data: duration} = action;
      window.localStorage.rankDuration = JSON.stringify(duration);
      return duration;
    }
    default: {
      return state;
    }
  }
}
