import { useContext } from 'react';
import { Client as xrplClient } from 'xrpl';
import { XRPLClientContext } from '../client-provider';

export function useXRPLClient(): xrplClient {
    const client = useContext(XRPLClientContext);

    if (!client) {
        throw new Error('Client context not found!');
    }

    return client;
}
