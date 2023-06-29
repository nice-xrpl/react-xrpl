import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getSellOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useWalletStores } from '../use-wallet-stores';

export function useGetSellOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;
    const { sellOffers } = useWalletStores();

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
