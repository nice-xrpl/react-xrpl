import { useNetworkEmitter } from '../use-network-emitter';
import { useAddress } from './use-address';
import { useStore } from 'src/react-xrpl/stores/use-store';
import { useEffect } from 'react';

/**
 * Custom hook that returns the buy offers for a given token ID.
 *
 * @param {string} tokenId - The ID of the token.
 * @param {string} [address] - The optional address to filter the buy offers by.
 * @return {Offer[] | undefined} The buy offers for the given token ID, or undefined if not found.
 */
export function useBuyOffers(tokenId: string, address?: string) {
    const networkEmitter = useNetworkEmitter();
    const internalAddress = useAddress(address);

    // const onCreated = (internalAddress: string) => {
    //     return buyOffers.setInitialBuyOffers(internalAddress, tokenId);
    // };

    useEffect(() => {
        networkEmitter.enableEventsForAddress(internalAddress).then(() => {
            if (networkEmitter.hasEventsForAddress(internalAddress)) {
                networkEmitter
                    .getBuyOfferStore(internalAddress)
                    .setInitialBuyOffers(tokenId);
            }
        });

        return () => {
            networkEmitter.disableEventsForAddress(internalAddress);
        };
    }, [internalAddress]);

    const offersStore = networkEmitter
        .getBuyOfferStore(internalAddress)
        .getStore();
    const offers = useStore(offersStore);

    return offers[tokenId];
}
