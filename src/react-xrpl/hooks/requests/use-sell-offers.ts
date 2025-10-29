import { useNetworkEmitter } from '../use-network-emitter';
import { useAddress } from './use-address';
import { useStore } from 'src/react-xrpl/stores/use-store';
import { useEffect } from 'react';

/**
 * A custom hook that retrieves sell offers for a given token from the XRPL network.
 *
 * @param {string} tokenId - The ID of the token for which to retrieve sell offers.
 * @param {string} [address] - (Optional) The address for which to retrieve sell offers. If not provided, the default address from the wallet store manager will be used.
 * @return {Offer[] | undefined} An array of sell offers for the given token, or undefined if the offers have not been fetched yet.
 */
export function useSellOffers(tokenId: string, address?: string) {
    const networkEmitter = useNetworkEmitter();
    const internalAddress = useAddress(address);

    useEffect(() => {
        networkEmitter.enableEventsForAddress(internalAddress).then(() => {
            if (networkEmitter.hasEventsForAddress(internalAddress)) {
                networkEmitter
                    .getSellOfferStore(internalAddress)
                    .setInitialSellOffers(tokenId);
            }
        });
    }, [internalAddress]);

    const offersStore = networkEmitter
        .getSellOfferStore(internalAddress)
        .getStore();
    const offers = useStore(offersStore);

    return offers[tokenId];
}
