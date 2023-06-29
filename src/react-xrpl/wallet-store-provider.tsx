import React, { createContext } from 'react';
import { WalletInitialState } from './api/wallet-types';
import { Store } from './stores/create-store';

export type WalletStores = {
    [K in keyof WalletInitialState]: Store<WalletInitialState[K]>;
};

type WalletStoreProviderProps = {
    store: WalletStores;
    children: React.ReactNode;
};

export const WalletStoreContext = createContext<WalletStores>(null!);

export function WalletStoreProvider({
    store,
    children,
}: WalletStoreProviderProps) {
    return (
        <WalletStoreContext.Provider value={store}>
            {children}
        </WalletStoreContext.Provider>
    );
}
