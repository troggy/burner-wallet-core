const Web3 = require('web3');
const Signer = require('./Signer');

const arrayEquals = (a, b) => a.length === b.length && a.every((val, i) => val === b[i]);

class InjectedSigner extends Signer {
  constructor({ autoEnable = false, provider = null }={}) {
    super({ id: 'injected' });
    this.accounts = [];
    this._provider = provider;

    const _provider = this.provider();
    if (_provider) {
      this.web3 = new Web3(_provider);
      this.updateAccounts();

      if (autoEnable && _provider.enable) {
        this.enable();
      }
    }
  }

  isAvailable() {
    return !!this.provider() && this.accounts.length > 0;
  }

  async signTx(tx) {
    const signedTransaction = await this.web3.eth.signTransaction(tx);
    return { ...tx, signedTransaction };
  }

  signMsg(msg, account) {
    return this.web3.eth.sign(msg, account);
  }

  shouldSkipSigning(network) {
    const isMetaMask = !!this.provider().isMetaMask;
    if (isMetaMask && network !== this.provider().networkVersion) {
      throw new Error('Metamask is connected to the wrong network');
    }

    return isMetaMask;
  }

  permissions() {
    const canEnable = this.accounts.length === 0 && (this.provider() || {}).enable;
    return canEnable ? ['enable'] : [];
  }

  invoke(action, account, ...params) {
    switch (action) {
      case 'enable':
        return this.enable();
      default:
        throw new Error(`Unknown action ${action}`);
    }
  }

  async enable() {
    await this.provider().enable();
    await this.updateAccounts();
  }

  async updateAccounts() {
    const accounts = await this.web3.eth.getAccounts();

    if (!arrayEquals(accounts, this.accounts)) {
      this.accounts = accounts;
      this.events.emit('accountChange');
    }
  }

  provider() {
    return this._provider || window.ethereum || (window.web3 && window.web3.currentProvider);
  }
}

module.exports = InjectedSigner;
