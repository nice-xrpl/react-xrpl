import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { createSellOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Creates a custom hook for creating a sell offer on the XRP Ledger network.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - tokenId: The ID of the token being sold.
 *   - amount: The amount of the token being sold.
 *   - options: An optional object containing additional options for the sell offer.
 *     - expiration: The expiration date of the sell offer.
 *     - flags: Additional flags for the sell offer.
 *     - destination: The destination address for the sell offer.
 * @return {Promise<TxResponse>} A promise that resolves to the transaction response.
 */
export function useCreateSellOffer() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (
            tokenId: string,
            amount: string,
            {
                expiration,
                destination,
                flags,
            }: {
                expiration?: Date | undefined;
                flags?: number | undefined;
                destination?: string | undefined;
            }
        ): Promise<TxResponse> => {
            const result = await createSellOffer(
                clientRef.current,
                walletRef.current,
                tokenId,
                amount,
                {
                    expiration,
                    destination,
                    flags,
                }
            );

            return result;
        },
        []
    );

    return send;
}
