const Gateway = require('./Gateway');
const Web3 = require('web3');

class InfuraGateway extends Gateway {
  constructor(infuraKey) {
    super();
    this.available = !!infuraKey;
    if (!infuraKey) {
      console.warn('Warning: InfuraGateway created without API Key. Infura will be unavailable.');
    }
    this.providerStrings = {
      '1': `wss://mainnet.infura.io/ws/v3/${infuraKey}`,
      '3': `wss://ropsten.infura.io/ws/v3/${infuraKey}`,
      '4': `wss://rinkeby.infura.io/ws/v3/${infuraKey}`,
      '5': `wss://goerli.infura.io/ws/v3/${infuraKey}`,
      '42': `wss://kovan.infura.io/ws/v3/${infuraKey}`,
    }
    this.providers = {};
  }

  isAvailable() {
    return this.available;
  }

  getNetworks() {
    return ['1', '3', '4', '5', '42'];
  }

  _provider(network) {
    if (!this.providers[network]) {
      if (!this.providerStrings[network]) {
        throw new Error(`Network ${network} not supported by InfuraGateway`);
      }
      this.providers[network] = new Web3.providers.WebsocketProvider(this.providerStrings[network]);
    }
    return this.providers[network];
  }

  send(network, payload) {
    return new Promise((resolve, reject) => {
      if (this.getNetworks().indexOf(network) === -1) {
        return reject(new Error('Infura does not support this network'));
      }
      this._provider(network).send(payload, (err, response) => {
        if (err || response.error) {
          reject(err || response.error);
        } else {
          resolve(response.result);
        }
      })
    });
  }

  stop() {
    Object.values(this.providers).forEach(provider => provider.disconnect());
  }
}

module.exports = InfuraGateway;
