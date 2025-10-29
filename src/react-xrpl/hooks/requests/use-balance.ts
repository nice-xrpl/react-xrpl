import { useStore } from 'src/react-xrpl/stores/use-store';
import { useNetworkEmitter } from '../use-network-emitter';
import { useAddress } from './use-address';
import { useEffect } from 'react';

/**
 * A custom hook that retrieves the balance of a given address using the WalletStoreManager.
 *
 * @param {string} address - The optional address to retrieve the balance for. If not provided, the balance of the currently selected address will be returned.
 * @return {Promise<string>} - A promise that resolves to the balance of the address as a string.
 */
export function useBalance(address?: string) {
    const networkEmitter = useNetworkEmitter();
    const internalAddress = useAddress(address);

    useEffect(() => {
        networkEmitter.enableEventsForAddress(internalAddress);

        return () => {
            networkEmitter.disableEventsForAddress(internalAddress);
        };
    }, [internalAddress]);

    const balanceStore = networkEmitter
        .getBalanceStore(internalAddress)
        .getStore();

    return useStore(balanceStore);
}
