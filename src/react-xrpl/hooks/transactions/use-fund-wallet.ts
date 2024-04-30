import { useCallback, useRef } from 'react';
import { useWallet, useXRPLClient } from '..';
import { Wallet } from 'xrpl';

/**
 * Returns a function that can be used to fund a wallet with a specified amount.
 *
 * @return {Function} A function that takes an amount as a string and returns a Promise that resolves to an object with the funded wallet and its balance.
 */
export function useFundWallet() {
    const client = useXRPLClient();
    const wallet = useWallet();
    const clientRef = useRef(client);
    clientRef.current = client;

    const fund = useCallback(
        async (
            amount: string
        ): Promise<{
            wallet: Wallet;
            balance: number;
        }> => {
            const result = await clientRef.current.fundWallet(wallet, {
                amount,
            });

            return result;
        },
        []
    );

    return fund;
}
