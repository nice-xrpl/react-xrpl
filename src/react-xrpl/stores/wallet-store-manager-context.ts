import { createContext } from 'react';
import { StoreManager } from './store-manager';
import { Currency, OfferStore, Token } from '../api/wallet-types';

export type WalletStoreManager = {
    balance: StoreManager<number>;
    buyOffers: StoreManager<OfferStore>;
    sellOffers: StoreManager<OfferStore>;
    currencies: StoreManager<Currency[]>;
    tokens: StoreManager<Token[]>;
};

export const WalletStoreManagerContext = createContext<WalletStoreManager>(
    null!
);
