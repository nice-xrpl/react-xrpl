import { useCallback, useRef } from 'react';
import { TxResponse } from 'xrpl';
import { burnToken } from '../../api/transactions';
import { useWallet } from '../use-wallet';
import { useXRPLClient } from '../use-xrpl-client';

/**
 * Creates a custom hook that burns a non-fungible token by submitting an NFTokenBurn transaction to the XRPL network.
 *
 * @return {Function} A function that accepts a token ID and returns a promise of TxResponse.
 */
export function useBurnToken() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const create = useCallback(async (tokenID: string): Promise<TxResponse> => {
        const result = await burnToken(
            clientRef.current,
            walletRef.current,
            tokenID
        );

        return result;
    }, []);

    return create;
}
