import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { sendCurrency } from '../../api/transactions';
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
            amount: string
        ): Promise<TxResponse> => {
            const result = await sendCurrency(
                clientRef.current,
                walletRef.current,
                destinationAddress,
                currencyCode,
                amount
            );

            return result;
        },
        []
    );

    return send;
}
