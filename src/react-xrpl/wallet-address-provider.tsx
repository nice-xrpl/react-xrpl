import React, { createContext } from 'react';
import { WalletAddressContext } from './wallet-address-context';

type WalletProviderProps = {
    address: string;
    children: React.ReactNode;
};

export function WalletAddressProvider({
    address,
    children,
}: WalletProviderProps) {
    return (
        <WalletAddressContext.Provider value={address}>
            {children}
        </WalletAddressContext.Provider>
    );
}
