import { useCallback /* , useRef */ } from 'react';
import { createWallet } from '../api';
// import { useXRPLClient } from '.';
import { Wallet } from 'xrpl';

/**
 * Returns a function that creates a new wallet using the provided seed.
 *
 * @return {Function} A function that takes an optional seed string and returns a Wallet object.
 */
export function useCreateWallet() {
    // const client = useXRPLClient();
    // const clientRef = useRef(client);
    // clientRef.current = client;

    const create = useCallback((seed?: string): Wallet => {
        return createWallet(/* clientRef.current,  */ seed);
    }, []);

    return create;
}
