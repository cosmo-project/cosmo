/**
*
* TryNowButton
*
*/

import React, { PropTypes } from 'react';

import styles from './styles.css';

function TryNowButton(props) {
  return (
    <button onClick={props.onClick} className={styles.tryNowButton}>
      Try Contract Now !
    </button>
  );
}

TryNowButton.propTypes = {
  onClick: PropTypes.func,
};

export default TryNowButton;
