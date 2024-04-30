import { useCallback, useRef } from 'react';
import { getTokens } from '../../api/requests';
import { useXRPLClient } from '../use-xrpl-client';
import { useAddress } from './use-address';

/**
 * A hook that retrieves tokens associated with a given address.
 *
 * @return {function} A function that, when called, retrieves tokens.
 */
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
