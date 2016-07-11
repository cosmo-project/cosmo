/*
 *
 * ConsoleLog reducer
 *
 */

import { fromJS } from 'immutable';
import {
  LOG_MESSAGE,
} from './constants';

const initialState = fromJS({
  messages: [
    {
      kind: 'info',
      message: 'Welcome to Cosmo!',
    },
  ],
});

function consoleLogReducer(state = initialState, action) {
  switch (action.type) {
    case LOG_MESSAGE:
      return state.set('messages', state.get('messages').push(fromJS({
        kind: action.kind,
        message: action.message,
      })));
    default:
      return state;
  }
}

export default consoleLogReducer;
