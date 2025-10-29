import { useStore } from 'src/react-xrpl/stores/use-store';
import { useNetworkEmitter } from '../use-network-emitter';
import { useAddress } from './use-address';
import { useEffect } from 'react';

/**
 * Retrieves the currency balance for a given address using the WalletStoreManager.
 *
 * @param {string} [address] - The optional address to retrieve the currency balance for. If not provided, the balance of the currently selected address will be returned.
 * @return {Currency[]} - An array of Currency objects representing the currency balance of the address.
 */
export function useCurrencyBalance(address?: string) {
    const networkEmitter = useNetworkEmitter();
    const internalAddress = useAddress(address);

    useEffect(() => {
        networkEmitter.enableEventsForAddress(internalAddress);

        return () => {
            networkEmitter.disableEventsForAddress(internalAddress);
        };
    }, [internalAddress]);

    const currencyStore = networkEmitter
        .getCurrencyStore(internalAddress)
        .getStore();

    return useStore(currencyStore);
}
