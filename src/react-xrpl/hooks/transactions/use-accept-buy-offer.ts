import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { acceptBuyOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Generates a function comment for the given function body.
 *
 * @return {Function} A function that accepts a token offer ID and returns a promise of TxResponse.
 */
export function useAcceptBuyOffer() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (tokenOfferId: string): Promise<TxResponse> => {
            const result = await acceptBuyOffer(
                clientRef.current,
                walletRef.current,
                tokenOfferId
            );

            return result;
        },
        []
    );

    return send;
}
