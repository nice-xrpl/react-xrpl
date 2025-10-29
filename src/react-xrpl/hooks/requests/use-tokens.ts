import { useStore } from 'src/react-xrpl/stores/use-store';
import { useNetworkEmitter } from '../use-network-emitter';
import { useAddress } from './use-address';
import { useEffect } from 'react';

/**
 * Retrieves the tokens associated with a given address using the WalletStoreManager.
 *
 * @param {string} [address] - The optional address to retrieve the tokens for. If not provided, the tokens of the currently selected address will be returned.
 * @return {Promise<Token[]>} - A promise that resolves to an array of tokens associated with the address.
 */
export function useTokens(address?: string) {
    const networkEmitter = useNetworkEmitter();
    const internalAddress = useAddress(address);

    useEffect(() => {
        networkEmitter.enableEventsForAddress(internalAddress);

        return () => {
            networkEmitter.disableEventsForAddress(internalAddress);
        };
    }, [internalAddress]);

    const tokenStore = networkEmitter.getTokenStore(internalAddress).getStore();

    return useStore(tokenStore);
}
