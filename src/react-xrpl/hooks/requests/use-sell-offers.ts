import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';

/**
 * A custom hook that retrieves sell offers for a given token from the XRPL network.
 *
 * @param {string} tokenId - The ID of the token for which to retrieve sell offers.
 * @param {string} [address] - (Optional) The address for which to retrieve sell offers. If not provided, the default address from the wallet store manager will be used.
 * @return {Offer[] | undefined} An array of sell offers for the given token, or undefined if the offers have not been fetched yet.
 */
export function useSellOffers(tokenId: string, address?: string) {
    const { sellOffers } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return sellOffers.setInitialSellOffers(internalAddress, tokenId);
    };

    const offers = useStoreManager(sellOffers, onCreated, address);

    return offers[tokenId];
}
