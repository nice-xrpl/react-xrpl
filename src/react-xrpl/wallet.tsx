import React, { useEffect, useState } from 'react';
import { Wallet as xrplWallet } from 'xrpl';
import { WalletProvider } from './wallet-provider';
import { createWalletFromSeed } from './api';
import { WalletAddress } from './wallet-address';
import { useXRPLClient } from './hooks';
import { createWalletStore } from './create-wallet-store';
import { WalletStores } from './wallet-store-provider';

type WalletProps = {
    seed: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function Wallet({ seed, fallback = <></>, children }: WalletProps) {
    const client = useXRPLClient();
    const [wallet, setWallet] = useState<xrplWallet>();

    const [walletStore] = useState<WalletStores>(() => {
        return createWalletStore();
    });

    useEffect(() => {
        createWalletFromSeed(client, seed).then((created) => {
            // console.log('created wallet...');
            setWallet(created.wallet);

            walletStore.balance.setState(created.balance);
            walletStore.currencies.setState(created.currencies);
            walletStore.tokens.setState(created.tokens);
            walletStore.buyOffers.setState(created.buyOffers);
            walletStore.sellOffers.setState(created.sellOffers);
        });
    }, [seed]);

    return wallet ? (
        <WalletProvider wallet={wallet}>
            <WalletAddress address={wallet.address}>{children}</WalletAddress>
        </WalletProvider>
    ) : (
        fallback
    );
}
