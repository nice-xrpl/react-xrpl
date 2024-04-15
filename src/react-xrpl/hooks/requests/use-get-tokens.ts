import { useCallback, useRef } from 'react';
import { getTokens } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAddress } from './use-address';

export function useGetTokens() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const address = useAddress();

    const get = useCallback(async () => {
        const result = await getTokens(clientRef.current, address);

        return result;
    }, [address]);

    return get;
}
