import { createContext } from 'react';
import { BalanceStoreManager } from './account-stores/balance-store';
import { BuyOfferStoreManager } from './account-stores/buy-offer-store';
import { SellOfferStoreManager } from './account-stores/sell-offer-store';
import { CurrencyStoreManager } from './account-stores/currency-store';
import { TokenStoreManager } from './account-stores/token-store';

export const WalletStoreManagerContext = createContext<{
    balance: BalanceStoreManager;
    buyOffers: BuyOfferStoreManager;
    sellOffers: SellOfferStoreManager;
    currencies: CurrencyStoreManager;
    tokens: TokenStoreManager;
}>(null!);
