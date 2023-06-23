import { useContext } from 'react';
import { WalletStoreContext } from '../wallet-provider';

export function useWalletStores() {
    const stores = useContext(WalletStoreContext);

    if (!stores) {
        throw new Error('Wallet stores context not found!');
    }

    return stores;
}
