import { useStore } from '../../stores/use-store';
import { useWalletStores } from '../use-wallet-stores';

export function useBuyOffers(tokenId: string) {
    const { buyOffers } = useWalletStores();

    return useStore(buyOffers)[tokenId];
}
