import { useContext } from 'react';
import { ClientStoreContext } from '../client-store-context';

/**
 * Custom hook that retrieves the client stores from the ClientStoreContext.
 *
 * @return {Object} The client stores object containing various store managers.
 */
export function useClientStores() {
    const stores = useContext(ClientStoreContext);

    // if (!stores) {
    //     throw new Error('Client stores context not found!');
    // }

    return stores;
}
