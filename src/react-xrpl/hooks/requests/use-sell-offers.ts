import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

export function useSellOffers(tokenId: string, address?: string) {
    const { sellOffers } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return sellOffers.setInitialSellOffers(internalAddress, tokenId);
    };

    const offers = useStoreManager(sellOffers, onCreated, address);

    return offers[tokenId];
}
