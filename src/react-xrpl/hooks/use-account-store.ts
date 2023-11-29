import { useContext } from 'react';
import { AccountStoresContext } from '../account-stores-context';

export function useAccountStore() {
    const stores = useContext(AccountStoresContext);

    if (!stores) {
        throw new Error('Account store context not found!');
    }

    return stores;
}
