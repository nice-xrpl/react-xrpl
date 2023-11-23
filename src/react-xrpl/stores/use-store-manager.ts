import { useEffect } from 'react';
import { StoreManager } from './store-manager';

export function useStoreManager<T>(manager: StoreManager<T>, address: string) {
    const store = manager.getStore(address);

    useEffect(() => {
        return () => {
            manager.releaseStore(address);
        };
    }, [address]);

    return store;
}
