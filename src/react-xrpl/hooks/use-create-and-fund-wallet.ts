import { useCallback, useRef } from 'react';
import { createAndFundWallet } from '../api';
import { useXRPLClient } from '.';
import { Wallet } from 'xrpl';

export function useCreateAndFundWallet() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const create = useCallback(async (amount: string): Promise<Wallet> => {
        const result = await createAndFundWallet(clientRef.current, amount);

        return result;
    }, []);

    return create;
}
