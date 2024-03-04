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
    const client = useXRPLClient();
    const [ready, setReady] = useState(false);
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

    const walletStoreManager = useWalletStoreManager();

    const stores = useMemo(() => {
        return walletStoreManager.getStoresForAddress(internalAddress);
    }, [internalAddress]);

    // TODO: Handle case where a wallet will have valid credentials, but the account will not exist.
    useEffect(() => {
        getInitialWalletState(client, internalAddress)
            .then((state) => {
                console.log(internalAddress, state);

                stores.balance.setState(state.balance);
                stores.currencies.setState(state.currencies);
                stores.tokens.setState(state.tokens);
                stores.buyOffers.setState(state.buyOffers);
                stores.sellOffers.setState(state.sellOffers);
                stores.transactionLog.setState(state.transactions);

                setReady(true);
            })
            .catch((error) => {
                throw error;
            });
    }, [internalAddress, stores]);

    useEffect(() => {
        return () => {
            stores.release();
        };
    }, [stores]);

    // enable account events
    // update store

    return ready ? (
        address ? (
            <WalletAddressContext.Provider value={internalAddress}>
                <AccountStoresContext.Provider value={stores}>
                    <AccountEvents />
                    {children}
                </AccountStoresContext.Provider>
            </WalletAddressContext.Provider>
        ) : (
            <AccountStoresContext.Provider value={stores}>
                <AccountEvents />
                {children}
            </AccountStoresContext.Provider>
        )
    ) : (
        fallback
    );
}
