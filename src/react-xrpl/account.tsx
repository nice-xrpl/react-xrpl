import React, { useContext, useMemo } from 'react';
import { WalletAddressContext } from './wallet-address-context';

type AccountProps = {
    address?: string;
    fallback?: React.ReactElement;
    children?: React.ReactNode;
};

/**
 * A React component that manages the account address based on context or provided address.
 *
 * @param {string} address - The address of the account.
 * @param {React.ReactElement} fallback - The fallback element to render.
 * @param {React.ReactNode} children - The child components.
 * @return {JSX.Element} The JSX element representing the account.
 */
export function Account({ address, fallback = <></>, children }: AccountProps) {
    // TODO: support suspense
    // TODO: require ErrorBoundary for error handling
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

    return address ? (
        <WalletAddressContext.Provider value={internalAddress}>
            {children}
        </WalletAddressContext.Provider>
    ) : (
        <>{children}</>
    );
}
