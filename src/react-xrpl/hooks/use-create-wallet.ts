import { useCallback /* , useRef */ } from 'react';
import { createWallet } from '../api';
// import { useXRPLClient } from '.';
import { Wallet } from 'xrpl';

export function useCreateWallet() {
    // const client = useXRPLClient();
    // const clientRef = useRef(client);
    // clientRef.current = client;

    const create = useCallback((seed?: string): Wallet => {
        return createWallet(/* clientRef.current,  */ seed);
    }, []);

    return create;
}
