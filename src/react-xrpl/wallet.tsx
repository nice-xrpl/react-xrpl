import React, { useEffect, useState } from 'react';
import { Wallet as xrplWallet } from 'xrpl';
import { WalletProvider } from './wallet-provider';
import { createWalletFromSeed } from './api';
import { useXRPLClient } from './hooks';
import { Account } from './account';

type WalletProps = {
    seed: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function Wallet({ seed, fallback = <></>, children }: WalletProps) {
    const client = useXRPLClient();
    const [wallet, setWallet] = useState<xrplWallet>();

    useEffect(() => {
        createWalletFromSeed(client, seed).then((created) => {
            // console.log('created wallet...');
            setWallet(created.wallet);
        });
    }, [seed]);

    return wallet ? (
        <WalletProvider wallet={wallet}>
            <Account address={wallet.address}>{children}</Account>
        </WalletProvider>
    ) : (
        fallback
    );
}
