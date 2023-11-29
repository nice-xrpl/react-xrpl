import React, { useEffect, useMemo, useState } from 'react';
import { useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';
import { WalletAddressContext } from './wallet-address-context';
import { AccountEvents } from './account-events';
import { useWalletStoreManager } from './stores/use-wallet-store-manager';
import { AccountStoresContext } from './account-stores-context';

type AccountProps = {
    address: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function Account({ address, fallback = <></>, children }: AccountProps) {
    const client = useXRPLClient();
    const [ready, setReady] = useState(false);

    const walletStoreManager = useWalletStoreManager();

    const stores = useMemo(() => {
        return walletStoreManager.getStoresForAddress(address);
    }, [address]);

    useEffect(() => {
        getInitialWalletState(client, address).then((state) => {
            console.log(address, state);

            stores.balance.setState(state.balance);
            stores.currencies.setState(state.currencies);
            stores.tokens.setState(state.tokens);
            stores.buyOffers.setState(state.buyOffers);
            stores.sellOffers.setState(state.sellOffers);

            setReady(true);
        });
    }, [address, stores]);

    useEffect(() => {
        return () => {
            stores.release();
        };
    }, [stores]);

    // enable account events
    // update store

    return ready ? (
        <WalletAddressContext.Provider value={address}>
            <AccountStoresContext.Provider value={stores}>
                <AccountEvents />
                {children}
            </AccountStoresContext.Provider>
        </WalletAddressContext.Provider>
    ) : (
        fallback
    );
}
