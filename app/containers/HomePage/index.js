/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a neccessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import brace from 'brace'; // eslint-disable-line
import AceEditor from 'react-ace';
import TryNowButton from 'components/TryNowButton';
import styles from './styles.css';

import 'brace/mode/java';
import 'brace/theme/github';

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.contract = '';
  }

  onChange = (newValue) => {
    this.contract = newValue;
    console.log('change', newValue);
  }

  tryContract = () => {
    console.log('Something !', this.contract);
  }

  render() {
    return (
      <div className={styles.homePage}>
        <AceEditor
          mode="java"
          theme="github"
          onChange={this.onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
        <TryNowButton onClick={this.tryContract} />
      </div>
    );
  }
}
