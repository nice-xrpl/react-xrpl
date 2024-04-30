import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

/**
 * Custom hook that returns the buy offers for a given token ID.
 *
 * @param {string} tokenId - The ID of the token.
 * @param {string} [address] - The optional address to filter the buy offers by.
 * @return {Offer[] | undefined} The buy offers for the given token ID, or undefined if not found.
 */
export function useBuyOffers(tokenId: string, address?: string) {
    const { buyOffers } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return buyOffers.setInitialBuyOffers(internalAddress, tokenId);
    };

    const offers = useStoreManager(buyOffers, onCreated, address);

    return offers[tokenId];
}
