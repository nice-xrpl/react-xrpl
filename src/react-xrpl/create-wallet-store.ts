import { Currency, Token } from './api';
import { createStore } from './stores/create-store';

export function createWalletStore() {
    return {
        balance: createStore<number>(0),
        tokens: createStore<Token[]>([]),
        currencies: createStore<Currency[]>([]),
    };
}
