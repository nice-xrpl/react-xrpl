import { useCallback, useRef } from 'react';
import { getXRPBalance } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAddress } from './use-address';

export function useGetXRPBalance() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const address = useAddress();

    const get = useCallback(async () => {
        const result = await getXRPBalance(clientRef.current, address);

        return result;
    }, [address]);

    return get;
}
