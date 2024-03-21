import { useWalletStoreManager } from '../stores/use-wallet-store-manager';
import { useAddress } from './requests/use-address';

export function useAccountStore(address?: string) {
    const internalAddress = useAddress(address);
    const storeManager = useWalletStoreManager();

    const store = storeManager;
}
