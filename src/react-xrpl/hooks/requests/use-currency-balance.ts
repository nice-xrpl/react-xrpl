import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

/**
 * Retrieves the currency balance for a given address using the WalletStoreManager.
 *
 * @param {string} [address] - The optional address to retrieve the currency balance for. If not provided, the balance of the currently selected address will be returned.
 * @return {Currency[]} - An array of Currency objects representing the currency balance of the address.
 */
export function useCurrencyBalance(address?: string) {
    const { currencies } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return currencies.setInitialBalance(internalAddress);
    };

    return useStoreManager(currencies, onCreated, address);
}
