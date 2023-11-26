import React, { useEffect, useState } from 'react';
import { useXRPLClient } from './hooks';
import { getInitialWalletState } from './api';
import { createWalletStore } from './create-wallet-store';
import { WalletStores } from './wallet-store-provider';
import { WalletAddressContext } from './wallet-address-context';

type AccountProps = {
    address: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function Account({ address, fallback = <></>, children }: AccountProps) {
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
        <WalletAddressContext.Provider value={address}>
            {children}
        </WalletAddressContext.Provider>
    ) : (
        fallback
    );
}
