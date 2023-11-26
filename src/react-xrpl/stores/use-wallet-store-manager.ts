import { useContext } from 'react';
import { WalletStoreManagerContext } from './wallet-store-manager-context';

export function useWalletStoreManager() {
    const walletStoreManager = useContext(WalletStoreManagerContext);

    if (!walletStoreManager) {
        throw new Error('Wallet store manager context not found!');
    }

    return walletStoreManager;
}
