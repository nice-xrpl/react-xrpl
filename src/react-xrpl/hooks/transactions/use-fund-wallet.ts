import { useCallback, useRef } from 'react';
import { useWallet, useXRPLClient } from '..';
import { Wallet } from 'xrpl';

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
            const result = await client.fundWallet(wallet, { amount });

            return result;
        },
        []
    );

    return fund;
}
