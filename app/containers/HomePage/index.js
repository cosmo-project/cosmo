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

const logContract = `contract log {
  event Log(string _message);

  function log(string _message) {
    Log(_message);
  }
}
`;

const helloWorldContract = `contract HelloWorld {
  function HelloWorld() {
    log("Hello World!!!");
  }
}
`;

function shimLogContract(contractInput) {
  return logContract + contractInput.replace(/log\("/g, 'new log("').replace(/new\snew\s/g, 'new ');
}

export default class HomePage extends React.Component { // eslint-disable-line react/prefer-stateless-function

  constructor() {
    super();
    this.editorValue = helloWorldContract;
    this.contracts = [];
    this.errors = [];
  }

  onChange = (newValue) => {
    this.editorContent = newValue;
  }

  tryContract = () => {
    const compileJSON = Module.cwrap('compileJSON', 'string', ['string', 'number']);   // eslint-disable-line
    const compiled = JSON.parse(compileJSON(shimLogContract(this.editorValue), true));

    if (typeof compiled.errors === 'undefined') {
      Object.keys(compiled.contracts).forEach((contractName) => {
        const contract = compiled.contracts[contractName];
        console.log(contractName + ': ' + contract.bytecode);  // eslint-disable-line
        console.log(contractName + '; ' + JSON.parse(contract.interface));  // eslint-disable-line
      });
    } else {
      console.log('Errors !', compiled.errors);  // eslint-disable-line
    }
  }

  render() {
    return (
      <div className={styles.homePage}>
        <AceEditor
          mode="java"
          theme="github"
          value={helloWorldContract}
          onChange={this.onChange}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
        />
        <TryNowButton onClick={this.tryContract} />
      </div>
    );
  }
}
