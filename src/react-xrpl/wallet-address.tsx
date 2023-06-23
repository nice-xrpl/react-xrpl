import React, { useEffect, useState } from 'react';
import { WalletStoreProvider, WalletStores } from './wallet-provider';
import { Currency, Token } from './api/wallet-types';
import { createStore } from './stores/create-store';
import { WalletEvents } from './wallet-events';
import { WalletAddressProvider } from './wallet-address-provider';
import { useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';

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
        return {
            balance: createStore<number>(0),
            tokens: createStore<Token[]>([]),
            currencies: createStore<Currency[]>([]),
        };
    });

    useEffect(() => {
        getInitialWalletState(client, address).then((state) => {
            console.log(address, state);
            walletStore.balance.setState(state.balance);
            walletStore.currencies.setState(state.currencies);
            walletStore.tokens.setState(state.tokens);

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
