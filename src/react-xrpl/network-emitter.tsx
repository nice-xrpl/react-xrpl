import { useEffect, useMemo } from 'react';
import { createNetworkEmitter } from './api/network-emitter';
import { useIsConnected, useXRPLClient } from './hooks';
import { NetworkEmitterContext } from './network-emitter-context';

export function NetworkEmitter({ children }: { children: React.ReactNode }) {
    const client = useXRPLClient();
    const isConnected = useIsConnected();

    const networkEmitter = useMemo(() => {
        return createNetworkEmitter(client);
    }, [client]);

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
