import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getBuyOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAccountStore } from '../use-account-store';

export function useGetBuyOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;
    const { buyOffers } = useAccountStore();

    const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
        const result = await getBuyOffers(clientRef.current, tokenId);

        buyOffers.setState((state) => {
            return {
                ...state,
                [tokenId]: result,
            };
        });

        return result;
    }, []);

    return send;
}
