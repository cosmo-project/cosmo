/*
 *
 * ConsoleLog
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import selectConsoleLog from './selectors';
import styles from './styles.css';
import Console from 'components/Console';

export class ConsoleLog extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className={styles.consoleLog}>
        <Console logMessages={this.props.logMessages.toJS()} />
      </div>
    );
  }
}

ConsoleLog.propTypes = {
  logMessages: React.PropTypes.object,
};

const mapStateToProps = createSelector(
  selectConsoleLog(),
  (logMessages) => ({ logMessages })
);

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsoleLog);
