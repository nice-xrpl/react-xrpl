import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { createBuyOffer } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

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
