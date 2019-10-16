import { Asset } from '@burner-wallet/assets';

export interface HistoryEventProps {
  id?: string,
  asset: string,
  receivingAsset?: string,
  type: 'send' | 'exchange',
  value: string,
  from: string,
  to: string,
  message?: string,
  tx: string,
  timestamp: number,
}

export default class HistoryEvent {
  public id: string;
  public asset: string;
  public receivingAsset?: string;
  public type: 'send' | 'exchange';
  public value: string;
  public from: string;
  public to: string;
  public message: string;
  public tx: string;
  public timestamp: number;

  constructor(props: HistoryEventProps);
  toJSON(): string;
  getAsset(): Asset;
  getReceivingAsset(): Asset | null;
}
