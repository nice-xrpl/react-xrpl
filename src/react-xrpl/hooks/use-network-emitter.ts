import { useContext } from 'react';
import { NetworkEmitter } from '../api/network-emitter';
import { NetworkEmitterContext } from '../network-emitter-context';

export function useNetworkEmitter(): NetworkEmitter {
    const networkEmitter = useContext(NetworkEmitterContext);

    if (!networkEmitter) {
        throw new Error('Network emitter context not found!');
    }

    return networkEmitter;
}
