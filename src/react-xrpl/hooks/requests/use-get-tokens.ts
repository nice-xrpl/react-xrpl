import { useCallback, useRef } from 'react';
import { getTokens } from '../../api/requests';
import { useWalletAddress } from '../use-wallet-address';
import { useXRPLClient } from '../use-xrpl-client';

export function useGetTokens() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const address = useWalletAddress();

    const get = useCallback(async () => {
        const result = await getTokens(clientRef.current, address);

        return result;
    }, [address]);

    return get;
}
