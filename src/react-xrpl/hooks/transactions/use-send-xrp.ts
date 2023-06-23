import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { sendXRP } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

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
