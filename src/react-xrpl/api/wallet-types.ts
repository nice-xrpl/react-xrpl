import { IssuedCurrencyAmount } from 'xrpl';

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

export type TransactionLogEntry =
    | {
          type: 'PaymentSent';
          to: string;
          account: string;
          timestamp: number;
          payload: {
              amount: string;
          };
      }
    | {
          type: 'PaymentReceived';
          from: string;
          account: string;
          timestamp: number;
          payload: {
              amount: string;
          };
      }
    | {
          type: 'CurrencySent';
          to: string;
          account: string;
          timestamp: number;
          payload: {
              amount: IssuedCurrencyAmount;
          };
      }
    | {
          type: 'CurrencyReceived';
          from: string;
          account: string;
          timestamp: number;
          payload: {
              amount: IssuedCurrencyAmount;
          };
      } | {
          type: 'CreateSellOffer';
          timestamp: number;
          payload: {
            token: string;
            offerId: string;
          }
      } | {
          type: 'AcceptSellOffer';
          timestamp: number;
          payload: {
            token: string;
            offerId: string;
          }
      } | {
          type: 'TokenMint';
          timestamp: number;
          payload: {
            token: string;
          }
      } | {
          type: 'TokenBurn';
          timestamp: number;
          payload: {
            token: string;
          }
      };

export type TransactionType = TransactionLogEntry['type'];

export type WalletInitialState = {
    // wallet: xrplWallet;
    balance: string;
    currencies: Currency[];
    tokens: Token[];
    sellOffers: OfferStore;
    buyOffers: OfferStore;
};
