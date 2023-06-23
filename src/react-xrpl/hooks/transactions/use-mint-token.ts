import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { mintToken } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

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
