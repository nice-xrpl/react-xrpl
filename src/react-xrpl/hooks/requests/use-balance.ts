import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

export function useBalance(address?: string) {
    const { balance } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return balance.setInitialBalance(internalAddress);
    };

    return useStoreManager(balance, onCreated, address);
}
