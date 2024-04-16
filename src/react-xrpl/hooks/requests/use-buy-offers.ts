import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

export function useBuyOffers(tokenId: string, address?: string) {
    const { buyOffers } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return buyOffers.setInitialBuyOffers(internalAddress, tokenId);
    };

    const offers = useStoreManager(buyOffers, onCreated, address);

    return offers[tokenId];
}
