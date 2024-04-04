import { useCallback, useRef } from 'react';
import { Amount, TxResponse } from 'xrpl';
import { sendCurrency, sendCurrencyAmount } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

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
