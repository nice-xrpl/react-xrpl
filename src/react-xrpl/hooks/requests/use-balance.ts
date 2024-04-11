import { useEffect } from 'react';
import { useStore } from '../../stores/use-store';
import { useAddress } from './use-address';
import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { suspend } from 'suspend-react';

export function useBalance(address?: string) {
    // get the current address from account context
    const internalAddress = useAddress(address);
    const { balance } = useWalletStoreManager();

    // get the balance store for the address
    const [store, created] = balance.getStore(internalAddress);

    suspend(async () => {
        if (created) {
            const value = await balance.setInitialBalance(internalAddress);

            return value;
        }

        return store.getState();
    });

    // set up network event if needed
    useEffect(() => {
        const firstRef = balance.markStore(internalAddress);

        if (firstRef) {
            balance.enableEvents(internalAddress);
        }

        return () => {
            const released = balance.releaseStore(internalAddress);

            if (released) {
                balance.disableEvents(internalAddress);
            }
        };
    }, [internalAddress, balance, created]);

    // return the store
    return useStore(store);
}
