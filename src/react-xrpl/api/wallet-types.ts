import { Amount, IssuedCurrencyAmount, Wallet as xrplWallet } from 'xrpl';

export type Currency = {
    issuer: string;
    value: number;
    currency: string;
};

export type Token = {
    flags: number;
    issuer: string;
    id: string;
    taxon: number;
    uri: string;
};

export type Offer = {
    index: string;
    amount: string;
    owner: string;
    expiration?: number;
    destination?: string;
};

export type OfferStore = {
    [key in string]?: Offer[];
};

const TransactionTypes = {
    PaymentSent: 'PaymentSent',
    PaymentReceived: 'PaymentReceived',
} as const;

export type TransactionType =
    (typeof TransactionTypes)[keyof typeof TransactionTypes];

export type TransactionLogEntry =
    | {
          type: 'PaymentSent';
          to: string;
          timestamp: number;
          payload: {
              amount: string;
          };
      }
    | {
          type: 'PaymentReceived';
          from: string;
          timestamp: number;
          payload: {
              amount: string;
          };
      }
    | {
          type: 'CurrencySent';
          to: string;
          timestamp: number;
          payload: {
              amount: IssuedCurrencyAmount;
          };
      }
    | {
          type: 'CurrencyReceived';
          from: string;
          timestamp: number;
          payload: {
              amount: IssuedCurrencyAmount;
          };
      };

export type WalletInitialState = {
    // wallet: xrplWallet;
    balance: string;
    currencies: Currency[];
    tokens: Token[];
    sellOffers: OfferStore;
    buyOffers: OfferStore;
    transactions: TransactionLogEntry[];
};
