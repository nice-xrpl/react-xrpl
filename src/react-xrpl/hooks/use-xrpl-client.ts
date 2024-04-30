import { useContext } from 'react';
import { Client as xrplClient } from 'xrpl';
import { XRPLClientContext } from '../client-context';

/**
 * Retrieves the XRPL client from the XRPLClientContext.
 *
 * @return {xrplClient} The XRPL client instance.
 */
export function useXRPLClient(): xrplClient {
    const client = useContext(XRPLClientContext);

    if (!client) {
        throw new Error('Client context not found!');
    }

    return client;
}
