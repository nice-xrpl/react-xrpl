import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { sendXRP } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Generates a custom hook for sending XRP to a destination address.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - destinationAddress: The address to send the XRP to.
 *   - amount: The amount of XRP to be sent.
 * @return {Promise<TxResponse>} A promise that resolves with the result of the transaction submission.
 */
export function useSendXRP() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (
            destinationAddress: string,
            amount: number
        ): Promise<TxResponse> => {
            const result = await sendXRP(
                clientRef.current,
                walletRef.current,
                destinationAddress,
                amount
            );

            return result;
        },
        []
    );

    return send;
}
