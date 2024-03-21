import { createContext } from 'react';
import { StoreManager } from './store-manager';
import { Currency, OfferStore, Token } from '../api/wallet-types';
import { BalanceStoreManager } from './account-stores/balance-store';

export const WalletStoreManagerContext = createContext<{
    balance: BalanceStoreManager;
    buyOffers: StoreManager<OfferStore>;
    sellOffers: StoreManager<OfferStore>;
    currencies: StoreManager<Currency[]>;
    tokens: StoreManager<Token[]>;
}>(null!);
