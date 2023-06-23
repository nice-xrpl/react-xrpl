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
            tokenId: string,
            amount: string,
            {
                expiration,
                targetAddress,
            }: {
                expiration?: Date | undefined;
                targetAddress?: string | undefined;
            }
        ): Promise<TxResponse> => {
            const result = await createBuyOffer(
                clientRef.current,
                walletRef.current,
                tokenId,
                amount,
                {
                    expiration,
                    targetAddress,
                }
            );

            return result;
        },
        []
    );

    return send;
}
