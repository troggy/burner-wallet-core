import BurnerCore from '../BurnerCore';
import EventEmitter from '../lib/EventEmitter';

export interface SignerOptions {
  id?: string;
}

export interface SignedTransaction {
  signedTransaction: string;
  nonce: string;
  chainId: string;
  to: string;
  from: string;
  data: string;
  gas: string;
  gasPrice: string;
  useGSN?: boolean;
}

export default class Signer {
  protected events: EventEmitter;
  protected accounts: string[];
  protected core: BurnerCore | null;

  constructor(options?: SignerOptions);

  setCore(core: BurnerCore): void;
  isAvailable(): boolean;
  getAccounts(): string[];
  hasAccount(account: string): boolean;
  signTx(tx: any): Promise<SignedTransaction>;
  signMsg(message: any, account: string): Promise<string>;
  signTypedMsg(message: any, account: string): Promise<string>;
  shouldSkipSigning(): boolean;
  onAccountChange(callback: () => void): void;
  permissions(): string[];
  invoke(action: string, account: string, ...params: any[]): any;
}
