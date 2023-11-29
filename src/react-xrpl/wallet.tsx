import React, { useMemo } from 'react';
import { Wallet as xrplWallet } from 'xrpl';
import { Account } from './account';
import { WalletContext } from './wallet-context';

type WalletProps = {
    seed?: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

export function Wallet({ seed, fallback = <></>, children }: WalletProps) {
    const wallet = useMemo(() => {
        if (seed) {
            return xrplWallet.fromSeed(seed);
        }

        return xrplWallet.generate();
    }, [seed]);

    return wallet ? (
        <WalletContext.Provider value={wallet}>
            <Account address={wallet.address}>{children}</Account>
        </WalletContext.Provider>
    ) : (
        fallback
    );
}
