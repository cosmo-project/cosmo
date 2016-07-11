/**
*
* Console
*
*/

import React, { PropTypes } from 'react';

import styles from './styles.css';

function Console(props) {
  return (
    <pre className={styles.console}>
      {props.logMessages.map((messageObject) => `[${messageObject.kind}] ${(new Date()).toISOString()}: ${messageObject.message}
`)}
    </pre>
  );
}

Console.propTypes = {
  logMessages: PropTypes.array,
};

export default Console;
