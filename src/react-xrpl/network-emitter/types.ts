import { EventEmitter } from 'tseep';
import type { Amount, IssuedCurrencyAmount } from 'xrpl';
import { Store } from '../stores/create-store';
import { OfferStore, Token, Currency } from '../api/wallet-types';
import { BalanceStore } from './balance-store';
import { CurrencyStore } from './currency-store';
import { TokenStore } from './token-store';
import { BuyOfferStore } from './buy-offer-store';
import { SellOfferStore } from './sell-offer-store';

export const WalletEvents = {
    BalanceChange: 'balance-change',
    PaymentSent: 'payment-sent',
    PaymentRecieved: 'payment-recieved',
    CurrencyChange: 'currency-change',
    CurrencySent: 'currency-sent',
    CurrencyRecieved: 'currency-recieved',
    TokenMint: 'token-mint',
    TokenBurn: 'token-burn',
    CreateBuyOffer: 'create-buy-offer',
    CreateSellOffer: 'create-sell-offer',
    CancelBuyOffer: 'cancel-buy-offer',
    CancelSellOffer: 'cancel-sell-offer',
    AcceptBuyOffer: 'accept-buy-offer',
    AcceptSellOffer: 'accept-sell-offer',
    TransferToken: 'transfer-token',
    RefreshTokens: 'refresh-tokens',
} as const;

export type EventMap = {
    [WalletEvents.BalanceChange]: (
        balance: string,
        xrp: number,
        hash: string
    ) => void;
    [WalletEvents.PaymentSent]: (
        to: string,
        xrp: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.PaymentRecieved]: (
        from: string,
        xrp: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CurrencyChange]: () => void;
    [WalletEvents.CurrencySent]: (
        to: string,
        amount: IssuedCurrencyAmount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CurrencyRecieved]: (
        from: string,
        amount: IssuedCurrencyAmount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.TokenMint]: (
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.TokenBurn]: (
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CreateBuyOffer]: (
        ledgerIndex: string,
        token: string,
        amount: Amount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CreateSellOffer]: (
        ledgerIndex: string,
        token: string,
        amount: Amount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CancelBuyOffer]: (hash: string) => void;
    [WalletEvents.CancelSellOffer]: (hash: string) => void;
    [WalletEvents.AcceptBuyOffer]: (
        buyOfferId: string,
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.AcceptSellOffer]: (
        sellOfferId: string,
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.TransferToken]: (hash: string) => void;
    [WalletEvents.RefreshTokens]: (hash: string) => void;
};

export type AddressEvents = {
    emitter: EventEmitter<EventMap>;
    refCount: number;
    address: string;
    promiseChain: Promise<void>;
    subbed: boolean;

    // stores
    balance: BalanceStore;
    currencies: CurrencyStore;
    tokens: TokenStore;
    buyOffers: BuyOfferStore;
    sellOffers: SellOfferStore;
};
