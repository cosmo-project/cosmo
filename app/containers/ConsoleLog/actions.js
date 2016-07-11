/*
 *
 * ConsoleLog actions
 *
 */

import {
  LOG_MESSAGE,
} from './constants';

export function logMessage(messageKind, messageBody) {
  return {
    type: LOG_MESSAGE,
    kind: messageKind,
    message: messageBody,
  };
}
