import { useStore } from '../../stores/use-store';
import { useAccountStore } from '../use-account-store';

export function useCurrencyBalance() {
    const { currencies: currenciesStore } = useAccountStore();

    return useStore(currenciesStore);
}
