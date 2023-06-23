import { useStore } from '../../stores/use-store';
import { useWalletStores } from '../use-wallet-stores';

export function useTokens() {
    const { tokens: tokenStore } = useWalletStores();

    return useStore(tokenStore);
}
