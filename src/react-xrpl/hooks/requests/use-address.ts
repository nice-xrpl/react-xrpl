import { useMemo } from 'react';
import { useWalletAddress } from '../use-wallet-address';

/**
 * A hook that returns the address to be used in a component.
 *
 * @param {string} address - An optional address to be used.
 * @return {string} The address to be used in the component.
 */
export function useAddress(address?: string) {
    const contextAddress = useWalletAddress();

    const internalAddress = useMemo(() => {
        if (address) {
            return address;
        }

        if (contextAddress) {
            return contextAddress;
        }

        throw new Error(
            'useAddress must be inside a Wallet or specify an address'
        );
    }, [address, contextAddress]);

    return internalAddress;
}
