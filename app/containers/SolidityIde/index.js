/*
 *
 * SolidityIde
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// import selectSolidityIde from './selectors';
import styles from './styles.css';
import brace from 'brace'; // eslint-disable-line
import AceEditor from 'react-ace';
import TryNowButton from 'components/TryNowButton';
import ConsoleLog from 'containers/ConsoleLog';
import { fromJS } from 'immutable';
import { logMessage } from 'containers/ConsoleLog/actions';
import Web3 from 'web3';

import 'brace/theme/github';
require('../../mode-solidity');

const logContract = `contract log {
  event log_string(string _value);
  event log_uint(uint _value);
  event log_uint8(uint8 _value);
  event log_bytes32(bytes32 _value);
  event log_bool(bool _value);
  event log_bytes(bytes _value);
}
`;

const runContract = `import "cosmo/log.sol";

contract Run is log {
  function helloWorld() {
    log_string("Hello World!!!");
  }
}
`;

const cosmoLogEventNames = [
  'log_string',
  'log_uint',
  'log_uint8',
  'log_bytes32',
  'log_bool',
  'log_bytes',
];

function shimCosmoLogImport(contractInput) {
  return contractInput.replace(/import( +)("|')cosmo\/log.sol("|');/g, logContract);
}

export class SolidityIde extends React.Component { // eslint-disable-line react/prefer-stateless-function
  constructor() {
    super();
    this.editorValue = runContract;
    this.contracts = [];
    this.errors = [];
    this.testrpc = window.TestRPC;
    this.web3 = new Web3(this.testrpc.provider());
    this.account = '0x';
    this.txObject = fromJS({
      from: '0x',
      gas: 300000,
    });

    this.web3.eth.getAccounts((accountsError, accounts) => {
      if (accountsError) {
        console.log(accountsError);  // eslint-disable-line
      }

      this.account = accounts[0];
      this.txObject = this.txObject.set('from', this.account);
    });
  }

  onChange = (newValue) => {
    this.editorValue = newValue;
  }

  tryContract = () => {
    const compileJSON = Module.cwrap('compileJSON', 'string', ['string', 'number']);   // eslint-disable-line
    let runContractNewTxObject = this.txObject;
    const runContractMethodTxObject = this.txObject;
    const dispatch = this.props.dispatch;
    const compiled = JSON.parse(compileJSON(shimCosmoLogImport(this.editorValue), true));

    if (typeof compiled.errors === 'undefined') {
      Object.keys(compiled.contracts).forEach((contractName) => {
        const contract = compiled.contracts[contractName];

        if (contractName === 'Run') {
          const RunContractInterface = JSON.parse(contract.interface);
          const RunContract = this.web3.eth.contract(RunContractInterface);
          runContractNewTxObject = runContractNewTxObject.set('data', `${contract.bytecode}`);

          RunContract.new(runContractNewTxObject.toJS(), (runContractError, runContractInstance) => {
            // if run contract deployment error
            if (runContractError) {
              dispatch(logMessage('error', String(runContractError)));
            }

            // if contract deployes fine
            if (!runContractError && runContractInstance.address) {
              cosmoLogEventNames.forEach((logEventMethodName) => {
                runContractInstance[logEventMethodName]({}, (logError, logResult) => {
                  if (logError) {
                    dispatch(logMessage('error', `(${logEventMethodName}) ${String(logError)}`));
                  }

                  dispatch(logMessage('info', `(${logEventMethodName})  ${logResult.args._value}`)); // eslint-disable-line
                });
              });

              RunContractInterface.forEach((method) => {
                if (method.type === 'function' && method.constant === false) {
                  runContractInstance[method.name](runContractMethodTxObject.toJS(), (methodError, methodTxHash) => {
                    if (methodError) {
                      dispatch(logMessage('error', `error while executing run contract method: ${String(methodError)}`));
                    }

                    if (methodTxHash) {
                      dispatch(logMessage('info', `transacting method '${method.name}': ${String(methodTxHash)}`));
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      dispatch(logMessage('error', `solc compiler error: ${JSON.stringify(compiled.errors)}`));
    }
  }

  render() {
    return (
      <div className={styles.solidityIde}>
        <AceEditor
          mode="javascript"
          theme="github"
          className="ace-tm"
          fontSize={15}
          value={runContract}
          onChange={this.onChange}
          name="SolidityContractAceEditor"
          editorProps={{ $blockScrolling: true }}
        />
        <TryNowButton onClick={this.tryContract} />
        <ConsoleLog />
      </div>
    );
  }
}

SolidityIde.propTypes = {
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => state.toJS(); // selectSolidityIde();

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SolidityIde);
