import { useContext } from 'react';
import { WalletStoreManagerContext } from './wallet-store-manager-context';

/**
 * Retrieves the wallet store manager from the WalletStoreManagerContext.
 *
 * @return {object} The wallet store manager object.
 * @throws {Error} If the WalletStoreManagerContext is not found.
 */
export function useWalletStoreManager() {
    const walletStoreManager = useContext(WalletStoreManagerContext);

    if (!walletStoreManager) {
        throw new Error('Wallet store manager context not found!');
    }

    return walletStoreManager;
}
