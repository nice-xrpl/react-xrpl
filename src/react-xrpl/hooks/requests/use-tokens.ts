import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

/**
 * Retrieves the tokens associated with a given address using the WalletStoreManager.
 *
 * @param {string} [address] - The optional address to retrieve the tokens for. If not provided, the tokens of the currently selected address will be returned.
 * @return {Promise<Token[]>} - A promise that resolves to an array of tokens associated with the address.
 */
export function useTokens(address?: string) {
    const { tokens } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return tokens.setInitialTokens(internalAddress);
    };

    return useStoreManager(tokens, onCreated, address);
}
