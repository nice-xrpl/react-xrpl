import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

/**
 * A custom hook that retrieves the balance of a given address using the WalletStoreManager.
 *
 * @param {string} address - The optional address to retrieve the balance for. If not provided, the balance of the currently selected address will be returned.
 * @return {Promise<string>} - A promise that resolves to the balance of the address as a string.
 */
export function useBalance(address?: string) {
    const { balance } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return balance.setInitialBalance(internalAddress);
    };

    return useStoreManager(balance, onCreated, address);
}
