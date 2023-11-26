import { useEffect, useMemo } from 'react';
import { createNetworkEmitter } from './api/network-emitter';
import { useXRPLClient } from './hooks';
import { NetworkEmitterContext } from './network-emitter-context';

export function NetworkEmitter({ children }: { children: React.ReactNode }) {
    const client = useXRPLClient();
    const networkEmitter = useMemo(() => {
        return createNetworkEmitter(client);
    }, [client]);

    useEffect(() => {
        networkEmitter.start();

        return () => {
            networkEmitter.stop();
        };
    }, [networkEmitter]);

    return (
        <NetworkEmitterContext.Provider value={networkEmitter}>
            {children}
        </NetworkEmitterContext.Provider>
    );
}
