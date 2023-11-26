import React, { useEffect, useState } from 'react';
import { useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';
import { createWalletStore } from './create-wallet-store';
import { WalletStores } from './wallet-store-provider';
import { WalletAddressContext } from './wallet-address-context';
import { AccountEvents } from './account-events';
import { useWalletStoreManager } from './stores/use-wallet-store-manager';

type AccountProps = {
    address: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function Account({ address, fallback = <></>, children }: AccountProps) {
    const client = useXRPLClient();
    const [ready, setReady] = useState(false);

    const walletStoreManager = useWalletStoreManager();

    useEffect(() => {
        const stores = walletStoreManager.getStoresForAddress(address);

        getInitialWalletState(client, address).then((state) => {
            console.log(address, state);

            stores.balance.setState(state.balance);
            stores.currencies.setState(state.currencies);
            stores.tokens.setState(state.tokens);
            stores.buyOffers.setState(state.buyOffers);
            stores.sellOffers.setState(state.sellOffers);

            setReady(true);
        });

        return () => {
            stores.release();
        };
    }, [address]);

    // enable account events
    // update store

    return ready ? (
        <WalletAddressContext.Provider value={address}>
            <AccountEvents />
            {children}
        </WalletAddressContext.Provider>
    ) : (
        fallback
    );
}
