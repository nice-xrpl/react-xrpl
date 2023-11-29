import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getSellOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAccountStore } from '../use-account-store';

export function useGetSellOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;
    const { sellOffers } = useAccountStore();

    const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
        const result = await getSellOffers(clientRef.current, tokenId);

        sellOffers.setState((state) => {
            return {
                ...state,
                [tokenId]: result,
            };
        });

        return result;
    }, []);

    return send;
}
