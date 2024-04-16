import { useEffect } from 'react';
import { useStore } from './use-store';
import { useAddress } from '../hooks/requests/use-address';
import { suspend } from 'suspend-react';
import { StoreManager } from './store-manager';
import internal from 'stream';

export function useStoreManager<
    R,
    S extends StoreManager<R> & {
        enableEvents: (address: string) => void;
        disableEvents: (address: string) => void;
    }
>(
    storeType: S,
    onCreated: (internalAddress: string) => Promise<R>,
    address?: string
) {
    // get the current address from account context
    const internalAddress = useAddress(address);

    // get the balance store for the address
    const [store, created] = storeType.getStore(internalAddress);
    const storeName = storeType.constructor.name;

    const result = suspend(async () => {
        console.log('suspending');
        if (created) {
            const result = await onCreated(internalAddress);
            console.log('created, returning: ', result);
            return result;
            // return await onCreated(internalAddress);
        }

        const result = store.getState();
        console.log('already created, returning: ', result);
        return result;
        // return store.getState();
    }, [internalAddress, storeName]);

    // set up network event if needed
    useEffect(() => {

        const firstRef = storeType.markStore(internalAddress);

        console.log('marked store: ', firstRef);

        if (firstRef) {
            storeType.enableEvents(internalAddress);
        }

        return () => {
            const released = storeType.releaseStore(internalAddress);

            console.log('released store: ', released);

            if (released) {
                storeType.disableEvents(internalAddress);
            }
        };
    }, [internalAddress, storeType, created]);

    // return the store
    return useStore(store);
}
