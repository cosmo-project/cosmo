import { createSelector } from 'reselect';

/**
 * Direct selector to the consoleLog state domain
 */
const selectConsoleLogDomain = () => state => state.get('consoleLog');

/**
 * Other specific selectors
 */


/**
 * Default selector used by ConsoleLog
 */

const selectConsoleLog = () => createSelector(
  selectConsoleLogDomain(),
  (consoleLogState) => consoleLogState.get('messages')
);

export default selectConsoleLog;
export {
  selectConsoleLogDomain,
};
