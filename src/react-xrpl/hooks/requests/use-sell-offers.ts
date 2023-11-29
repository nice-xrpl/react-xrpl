import { useStore } from '../../stores/use-store';
import { useAccountStore } from '../use-account-store';

export function useSellOffers(tokenId: string) {
    const { sellOffers } = useAccountStore();

    return useStore(sellOffers)[tokenId];
}
