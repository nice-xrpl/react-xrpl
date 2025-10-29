import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getBuyOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAddress } from './use-address';
import { useNetworkEmitter } from '../use-network-emitter';

/**
 * Custom hook that retrieves buy offers for a given token ID from the XRPL network.
 *
 * @return {Function} A function that, when called with a token ID, retrieves the buy offers for that token and updates the buyOffers store.
 */
export function useGetBuyOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const internalAddress = useAddress();
    const networkEmitter = useNetworkEmitter();

    const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
        const result = await getBuyOffers(clientRef.current, tokenId);

        const store = networkEmitter
            .getBuyOfferStore(internalAddress)
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
