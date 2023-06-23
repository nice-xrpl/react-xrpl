import React, { createContext } from 'react';
import { Wallet as xrplWallet } from 'xrpl';
import { Currency, Token } from './api/wallet-types';
import { Store } from './stores/create-store';

export const WalletContext = createContext<xrplWallet>(null!);

type WalletProviderProps = {
    wallet: xrplWallet;
    children: React.ReactNode;
};

export function WalletProvider({ wallet, children }: WalletProviderProps) {
    return (
        <WalletContext.Provider value={wallet}>
            {children}
        </WalletContext.Provider>
    );
}

export type WalletStores = {
    balance: Store<number>;
    tokens: Store<Token[]>;
    currencies: Store<Currency[]>;
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
