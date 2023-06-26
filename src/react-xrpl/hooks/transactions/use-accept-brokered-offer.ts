import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { acceptBrokeredOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

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
