import { useCallback, useRef } from 'react';
import { getXRPBalance } from '../../api/requests';
import { useWalletAddress } from '../use-wallet-address';
import { useXRPLClient } from '../use-xrpl-client';

export function useGetXRPBalance() {
    const client = useXRPLClient();
    const clientRef = useRef(client);
    clientRef.current = client;

    const address = useWalletAddress();

    const get = useCallback(async () => {
        const result = await getXRPBalance(clientRef.current, address);

        return result;
    }, [address]);

    return get;
}
