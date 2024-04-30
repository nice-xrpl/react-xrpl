import { useCallback, useRef } from 'react';
import { getXRPBalance } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAddress } from './use-address';

/**
 * Custom hook that returns a function to get the XRP balance of a given address using the provided XRP client.
 *
 * @return {Function} A function that takes no arguments and returns a Promise that resolves to the XRP balance as a string.
 */
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
