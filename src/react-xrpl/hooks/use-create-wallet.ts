import { useCallback, useRef } from 'react';
import { createWallet } from '../api';
import { XRPLWalletInitialState } from '../api/wallet-types';
import { useXRPLClient } from './';

export function useCreateWallet() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const create = useCallback(
        async (amount: string): Promise<XRPLWalletInitialState> => {
            const result = await createWallet(clientRef.current, amount);

            return result;
        },
        []
    );

    return create;
}
