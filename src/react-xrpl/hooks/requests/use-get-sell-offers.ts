import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getSellOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useAddress } from './use-address';

export function useGetSellOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;
    const { sellOffers } = useWalletStoreManager();
    const address = useAddress();

    const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
        const result = await getSellOffers(clientRef.current, tokenId);

        const [store] = sellOffers.getStore(address);

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
