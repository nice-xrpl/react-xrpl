import { useStore } from '../../stores/use-store';
import { useAccountStore } from '../use-account-store';

export function useTokens() {
    const { tokens: tokenStore } = useAccountStore();

    return useStore(tokenStore);
}
