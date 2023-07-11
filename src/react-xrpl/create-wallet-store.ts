import { Currency, OfferStore, Token } from './api';
import { createStore } from './stores/create-store';

export function createWalletStore() {
    return {
        balance: createStore<number>(0),
        tokens: createStore<Token[]>([]),
        currencies: createStore<Currency[]>([]),
        buyOffers: createStore<OfferStore>({}),
        sellOffers: createStore<OfferStore>({}),
    };
}
