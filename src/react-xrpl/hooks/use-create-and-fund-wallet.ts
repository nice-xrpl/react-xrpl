import { useCallback, useRef } from 'react';
import { createAndFundWallet } from '../api';
import { useXRPLClient } from '.';
import { Wallet } from 'xrpl';

/**
 * A custom hook for creating and funding a wallet.
 *
 * @param {string} amount - The amount to fund the wallet with.
 * @return {Promise<Wallet>} The funded wallet.
 */
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
