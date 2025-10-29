import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getSellOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAddress } from './use-address';
import { useNetworkEmitter } from '../use-network-emitter';

/**
 * Retrieves the sell offers for a given token from the XRPL network.
 *
 * @return {Function} A function that, when called with a token ID, retrieves the sell offers for that token and updates the sellOffers store.
 */
export function useGetSellOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;
    const internalAddress = useAddress();
    const networkEmitter = useNetworkEmitter();

    const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
        const result = await getSellOffers(clientRef.current, tokenId);

        const store = networkEmitter
            .getSellOfferStore(internalAddress)
            .getStore();

        store.setState((state) => {
            return {
                ...state,
                [tokenId]: result,
            };
        });

        return result;
    }, []);

    return send;
}
