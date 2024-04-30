import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { acceptBrokeredOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Creates a custom hook that accepts a brokered offer by submitting a transaction to the XRPL network.
 *
 * @return {Function} A function that accepts the following parameters:
 *   - tokenBuyOfferId: The ID of the buy offer.
 *   - tokenSellOfferId: The ID of the sell offer.
 *   - fee: The fee amount for the broker.
 */
export function useAcceptBrokeredOffer() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (
            tokenBuyOfferId: string,
            tokenSellOfferId: string,
            fee: string
        ): Promise<TxResponse> => {
            const result = await acceptBrokeredOffer(
                clientRef.current,
                walletRef.current,
                tokenBuyOfferId,
                tokenSellOfferId,
                fee
            );

            return result;
        },
        []
    );

    return send;
}
