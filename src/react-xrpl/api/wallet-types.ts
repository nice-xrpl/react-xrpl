import { Wallet as xrplWallet } from 'xrpl';

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
          address: string;
          timestamp: number;
          payload: {
              amount: number;
          };
      }
    | {
          type: 'PaymentReceived';
          address: string;
          timestamp: number;
          payload: {
              amount: number;
          };
      };

export type WalletInitialState = {
    // wallet: xrplWallet;
    balance: number;
    currencies: Currency[];
    tokens: Token[];
    sellOffers: OfferStore;
    buyOffers: OfferStore;
};

export type XRPLWalletInitialState = WalletInitialState & {
    wallet: xrplWallet;
};
