import React, { createContext } from 'react';
import { Wallet as xrplWallet } from 'xrpl';

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
