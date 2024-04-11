import { useEffect } from 'react';
import { useStore } from '../../stores/use-store';
import { useAddress } from './use-address';
import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { suspend } from 'suspend-react';

export function useCurrencyBalance(address?: string) {
    // get the current address from account context
    const internalAddress = useAddress(address);
    const { currencies } = useWalletStoreManager();

    // get the balance store for the address
    const [store, created] = currencies.getStore(internalAddress);

    suspend(async () => {
        if (created) {
            const value = await currencies.setInitialBalance(internalAddress);

            return value;
        }

        return store.getState();
    });

    // set up network event if needed
    useEffect(() => {
        const firstRef = currencies.markStore(internalAddress);

        if (firstRef) {
            currencies.enableEvents(internalAddress);
        }

        return () => {
            const released = currencies.releaseStore(internalAddress);

            if (released) {
                currencies.disableEvents(internalAddress);
            }
        };
    }, [internalAddress, currencies, created]);

    // return the store
    return useStore(store);
}
