import { useEffect } from 'react';
import { useStore } from '../../stores/use-store';
import { useAddress } from './use-address';
import { useWalletStoreManager } from 'src/react-xrpl/stores/use-wallet-store-manager';
import { suspend } from 'suspend-react';

export function useBalance(address?: string) {
    // get the current address from account context
    const internalAddress = useAddress(address);
    const storeManager = useWalletStoreManager();

    // get the balance store for the address
    const [store, release] = suspend(async () => {
        return storeManager.balance.getStore(internalAddress);
    }, [internalAddress]);

    useEffect(() => {
        return () => {
            release();
        };
    }, []);

    // set up network event if needed

    // return the balance store
    return useStore(store);
}
