import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

export function useCurrencyBalance(address?: string) {
    const { currencies } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return currencies.setInitialBalance(internalAddress);
    };

    return useStoreManager(currencies, onCreated, address);
}
