import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

export function useTokens(address?: string) {
    const { tokens } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return tokens.setInitialTokens(internalAddress);
    };

    return useStoreManager(tokens, onCreated, address);
}
