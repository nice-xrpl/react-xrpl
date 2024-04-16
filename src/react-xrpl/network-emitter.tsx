import { useEffect, useMemo } from 'react';
import { createNetworkEmitter } from './api/network-emitter';
import { useIsConnected, useXRPLClient } from './hooks';
import { NetworkEmitterContext } from './network-emitter-context';

export function NetworkEmitter({ children }: { children: React.ReactNode }) {
    const client = useXRPLClient();
    const isConnected = useIsConnected();

    const networkEmitter = useMemo(() => {
        console.log('creating network emitter...');
        return createNetworkEmitter(client);
    }, [client]);

    useEffect(() => {
        console.log('network emitter changed: ', networkEmitter);
    }, [networkEmitter]);

    useEffect(() => {
        if (isConnected) {
            networkEmitter.start();
        }

        return () => {
            if (isConnected) {
                networkEmitter.stop();
            }
        };
    }, [networkEmitter, isConnected]);

    return (
        <NetworkEmitterContext.Provider value={networkEmitter}>
            {children}
        </NetworkEmitterContext.Provider>
    );
}
