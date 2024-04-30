import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { mintToken } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Custom hook that provides a function to mint a token.
 *
 * @return {Function} A function that takes the following parameters:
 *   - url (string): The URL of the token to mint.
 *   - transferFee (number): The transfer fee for the token minting transaction. Defaults to 0.
 *   - options (Object): An optional object containing additional options:
 *     - flags (number): The flags for the mint transaction.
 *     - taxon (number): The taxon for the mint transaction.
 * @return {Promise<TxResponse>} A promise that resolves to the result of the mint transaction.
 */
export function useMintToken() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const create = useCallback(
        async (
            url: string,
            transferFee: number = 0,
            {
                flags,
                taxon,
            }: {
                flags?: number;
                taxon?: number;
            } = {}
        ): Promise<TxResponse> => {
            const result = await mintToken(
                clientRef.current,
                walletRef.current,
                url,
                transferFee,
                flags,
                taxon
            );

            return result;
        },
        []
    );

    return create;
}
