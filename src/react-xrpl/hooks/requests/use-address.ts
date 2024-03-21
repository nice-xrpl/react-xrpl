import { useMemo } from 'react';
import { useWalletAddress } from '../use-wallet-address';

export function useAddress(address?: string) {
    const internalAddress = useMemo(() => {
        const contextAddress = useWalletAddress();

        if (address) {
            return address;
        }

        if (contextAddress) {
            return contextAddress;
        }

        throw new Error(
            'useAddress must be inside a Wallet or specify an address'
        );
    }, [address]);

    return internalAddress;
}
