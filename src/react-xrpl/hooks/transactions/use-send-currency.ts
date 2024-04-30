import { useCallback, useRef } from 'react';
import { Amount, TxResponse } from 'xrpl';
import { sendCurrency, sendCurrencyAmount } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Creates a custom hook for sending currency to a destination address.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - destinationAddress: The address to send the currency to.
 *   - currencyCode: The code of the currency to be sent.
 *   - amount: The amount of currency to be sent. It can be a string or an Amount object.
 * @return {Promise<TxResponse>} A promise that resolves with the result of the transaction submission.
 */
export function useSendCurrency() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const send = useCallback(
        async (
            destinationAddress: string,
            currencyCode: string,
            amount: string | Amount
        ): Promise<TxResponse> => {
            if (typeof amount === 'string') {
                return await sendCurrency(
                    clientRef.current,
                    walletRef.current,
                    destinationAddress,
                    currencyCode,
                    amount
                );
            }

            return await sendCurrencyAmount(
                clientRef.current,
                walletRef.current,
                destinationAddress,
                amount
            );
        },
        []
    );

    return send;
}
