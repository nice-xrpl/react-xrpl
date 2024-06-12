import { useCallback, useRef } from 'react';
import { useXRPLClient } from '../use-xrpl-client';
import { useWallet } from '../use-wallet';
import { allowRippling } from '../../api/transactions';

export async function useAllowRippling() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const wallet = useWallet();
    const walletRef = useRef(wallet);
    walletRef.current = wallet;

    const allow = useCallback(async (allow: boolean) => {
        return await allowRippling(clientRef.current, walletRef.current, allow);
    }, []);

    return allow;
}
