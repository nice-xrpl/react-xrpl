import { useContext } from 'react';
import { NetworkEmitter } from '../api/network-emitter';
import { NetworkEmitterContext } from '../network-emitter-context';

/**
 * Retrieves the network emitter from the network emitter context.
 *
 * @return {NetworkEmitter} The network emitter instance.
 * @throws {Error} If the network emitter context is not found.
 */
export function useNetworkEmitter(): NetworkEmitter {
    const networkEmitter = useContext(NetworkEmitterContext);

    if (!networkEmitter) {
        throw new Error('Network emitter context not found!');
    }

    return networkEmitter;
}
