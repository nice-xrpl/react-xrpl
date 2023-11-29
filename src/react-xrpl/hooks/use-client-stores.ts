import { useContext } from 'react';
import { ClientStoreContext } from '../client-store-context';

export function useClientStores() {
    const stores = useContext(ClientStoreContext);

    // if (!stores) {
    //     throw new Error('Client stores context not found!');
    // }

    return stores;
}
