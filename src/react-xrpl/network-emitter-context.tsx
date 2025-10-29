import { createContext } from 'react';
import { NetworkEmitter } from './network-emitter/network-emitter';

export const NetworkEmitterContext = createContext<NetworkEmitter>(null!);
