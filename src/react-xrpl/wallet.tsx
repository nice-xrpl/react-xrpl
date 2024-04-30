import React, { useMemo } from 'react';
import { Wallet as xrplWallet } from 'xrpl';
import { Account } from './account';
import { WalletContext } from './wallet-context';
import { WalletAddressContext } from './wallet-address-context';

type WalletProps = {
    seed?: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

/**
 * Generates a wallet based on the provided seed. If no seed is provided, a new wallet is generated.
 *
 * @param {WalletProps} seed - The seed used to generate the wallet. Optional.
 * @param {React.ReactElement} fallback - The fallback element to render if no wallet is generated. Default is an empty fragment.
 * @param {React.ReactNode} children - The child elements to render within the wallet context.
 * @return {React.ReactNode} The rendered wallet context or the fallback element.
 */
export function Wallet({ seed, fallback = <></>, children }: WalletProps) {
    // TODO: use suspense
    const wallet = useMemo(() => {
        if (seed) {
            return xrplWallet.fromSeed(seed);
        }

        return xrplWallet.generate();
    }, [seed]);

    return wallet ? (
        <WalletContext.Provider value={wallet}>
            <WalletAddressContext.Provider value={wallet.address}>
                {children}
            </WalletAddressContext.Provider>
        </WalletContext.Provider>
    ) : (
        fallback
    );
}
