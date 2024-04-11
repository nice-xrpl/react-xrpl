import { useEffect } from 'react';
import { useStore } from './use-store';
import { useAddress } from '../hooks/requests/use-address';
import { useWalletStoreManager } from './use-wallet-store-manager';
import { suspend } from 'suspend-react';
import { StoreManager } from './store-manager';

export function useStoreManager<R, S extends StoreManager<R>>(
    storeType: S,
    onCreated: () => Promise<R>,
    address?: string
) {
    // get the current address from account context
    const internalAddress = useAddress(address);

    // get the balance store for the address
    const [store, created] = storeType.getStore(internalAddress);

    suspend(async () => {
        if (created) {
            return await onCreated();
        }

        return store.getState();
    });

    // set up network event if needed
    useEffect(() => {
        const firstRef = storeType.markStore(internalAddress);

        if (firstRef) {
            storeType.enableEvents(internalAddress);
        }

        return () => {
            const released = storeType.releaseStore(internalAddress);

            if (released) {
                storeType.disableEvents(internalAddress);
            }
        };
    }, [internalAddress, storeType, created]);

    // return the store
    return useStore(store);
}
