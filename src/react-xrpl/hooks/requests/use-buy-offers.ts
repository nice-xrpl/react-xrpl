import { useStore } from '../../stores/use-store';
import { useAccountStore } from '../use-account-store';

export function useBuyOffers(tokenId: string) {
    const { buyOffers } = useAccountStore();

    return useStore(buyOffers)[tokenId];
}
