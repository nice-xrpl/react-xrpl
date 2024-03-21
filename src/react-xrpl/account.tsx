import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';
import { WalletAddressContext } from './wallet-address-context';
import { AccountEvents } from './account-events';
import { useWalletStoreManager } from './stores/use-wallet-store-manager';
import { AccountStoresContext } from './account-stores-context';

type AccountProps = {
    address?: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

// TODO: support suspense
// TODO: require ErrorBoundary for error handling
export function Account({ address, fallback = <></>, children }: AccountProps) {
    const contextAddress = useContext(WalletAddressContext);

    const internalAddress = useMemo(() => {
        if (address) {
            return address;
        }

        if (contextAddress) {
            return contextAddress;
        }

        throw new Error(
            'Account must either be inside a Wallet or specify an address'
        );
    }, [address]);

    return address ? (
        <WalletAddressContext.Provider value={internalAddress}>
            {children}
        </WalletAddressContext.Provider>
    ) : (
        <>{children}</>
    );
}
