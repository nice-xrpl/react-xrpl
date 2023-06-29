import React, { useEffect, useState } from 'react';
import { WalletEvents } from './wallet-events';
import { WalletAddressProvider } from './wallet-address-provider';
import { useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';
import { createWalletStore } from './create-wallet-store';
import { WalletStoreProvider, WalletStores } from './wallet-store-provider';

type WalletAddressProps = {
    address: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function WalletAddress({
    address,
    fallback = <></>,
    children,
}: WalletAddressProps) {
    const client = useXRPLClient();
    const [ready, setReady] = useState(false);

    const [walletStore] = useState<WalletStores>(() => {
        return createWalletStore();
    });

    useEffect(() => {
        getInitialWalletState(client, address).then((state) => {
            console.log(address, state);
            walletStore.balance.setState(state.balance);
            walletStore.currencies.setState(state.currencies);
            walletStore.tokens.setState(state.tokens);
            walletStore.buyOffers.setState(state.buyOffers);
            walletStore.sellOffers.setState(state.sellOffers);

            setReady(true);
        });
    }, [address]);

    return ready ? (
        <WalletAddressProvider address={address}>
            <WalletStoreProvider store={walletStore}>
                <WalletEvents />
                {children}
            </WalletStoreProvider>
        </WalletAddressProvider>
    ) : (
        fallback
    );
}
