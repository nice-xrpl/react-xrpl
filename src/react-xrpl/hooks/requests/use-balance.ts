import { useStore } from '../../stores/use-store';
import { useAccountStore } from '../use-account-store';

export function useBalance() {
    const { balance: balanceStore } = useAccountStore();

    return useStore(balanceStore);
}
