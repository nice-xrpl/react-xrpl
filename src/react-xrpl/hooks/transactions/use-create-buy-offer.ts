import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { createBuyOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Creates a custom hook for creating a buy offer on the XRP Ledger network.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - owner: The address of the owner of the token.
 *   - tokenId: The ID of the token.
 *   - amount: The amount of the token to be bought.
 *   - options: An optional object containing additional options for the buy offer.
 *     - expiration: The expiration date of the buy offer.
 *     - destination: The destination address for the bought tokens.
 * @return {Promise<TxResponse>} A promise that resolves with the result of the transaction submission.
 */
export function useCreateBuyOffer() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (
            owner: string,
            tokenId: string,
            amount: string,
            {
                expiration,
                destination,
            }: {
                expiration?: Date | undefined;
                destination?: string | undefined;
            } = {}
        ): Promise<TxResponse> => {
            const result = await createBuyOffer(
                clientRef.current,
                walletRef.current,
                owner,
                tokenId,
                amount,
                {
                    expiration,
                    destination,
                }
            );

            return result;
        },
        []
    );

    return send;
}
