import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { cancelOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Creates a custom hook that cancels a token offer by submitting an NFTokenCancelOffer transaction to the XRPL network.
 *
 * @return {Function} A function that accepts a token offer ID and returns a promise of TxResponse.
 */
export function useCancelOffer() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (tokenOfferId: string): Promise<TxResponse> => {
            const result = await cancelOffer(
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
