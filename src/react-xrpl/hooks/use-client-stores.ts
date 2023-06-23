import { useContext } from 'react';
import { ClientStoreContext } from '../client-provider';

export function useClientStores() {
    const stores = useContext(ClientStoreContext);

    if (!stores) {
        throw new Error('Client stores context not found!');
    }

    return stores;
}
