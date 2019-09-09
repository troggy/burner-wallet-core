const Web3 = require('web3');
const Signer = require('./Signer');

const arrayEquals = (a, b) => a.length === b.length && a.every((val, i) => val === b[i]);

class InjectedSigner extends Signer {
  constructor() {
    super();
    this.accounts = [];
    if (this.isAvailable()) {
      this.web3 = new Web3(this._provider());
      this.updateAccounts();

      if (window.ethereum && window.ethereum.enable) {
        window.ethereum.enable().then(() => this.updateAccounts());
      }
    }
  }

  isAvailable() {
    return !!(window.ethereum || (window.web3 && window.web3.currentProvider));
  }

  signTx(tx) {
    return this.web3.eth.signTransaction(tx);
  }

  signMsg(msg, account) {
    return this.web3.eth.sign(msg, account);
  }

  shouldSkipSigning() {
    return !!this._provider().isMetaMask;
  }

  async updateAccounts() {
    const accounts = await this.web3.eth.getAccounts();

    if (!arrayEquals(accounts, this.accounts)) {
      this.accounts = accounts;
      this.events.emit('accountChange');
    }
  }

  _provider() {
    return window.ethereum || window.web3.currentProvider;
  }
}

module.exports = InjectedSigner;
