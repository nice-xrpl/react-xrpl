import { useCallback, useRef } from 'react';
import { Offer } from '../../api';
import { getBuyOffers } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useAddress } from './use-address';

export function useGetBuyOffers() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;
    const { buyOffers } = useWalletStoreManager();
    const address = useAddress();

    const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
        const result = await getBuyOffers(clientRef.current, tokenId);

        const [store] = buyOffers.getStore(address);

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
