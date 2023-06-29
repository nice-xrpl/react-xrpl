import { useStore } from '../../stores/use-store';
import { useWalletStores } from '../use-wallet-stores';

export function useSellOffers(tokenId: string) {
    const { sellOffers } = useWalletStores();

    return useStore(sellOffers)[tokenId];
}
