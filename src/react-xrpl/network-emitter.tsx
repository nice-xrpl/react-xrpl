import { useEffect, useMemo } from 'react';
import { useIsConnected, useXRPLClient } from './hooks';
import { NetworkEmitter as NetworkEmitterClass } from './network-emitter/network-emitter';
import { NetworkEmitterContext } from './network-emitter-context';

/**
 * Renders a NetworkEmitter component that provides a network emitter context to its children.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the NetworkEmitter.
 * @return {JSX.Element} The NetworkEmitter component.
 */
export function NetworkEmitter({ children }: { children: React.ReactNode }) {
    const client = useXRPLClient();
    const isConnected = useIsConnected();

    const networkEmitter = useMemo(() => {
        console.log('creating network emitter...');
        return new NetworkEmitterClass(client);
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
