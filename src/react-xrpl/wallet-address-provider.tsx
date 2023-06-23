import React, { createContext } from 'react';

export const WalletAddressContext = createContext<string>(null!);

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
