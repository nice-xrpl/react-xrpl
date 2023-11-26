import { createContext } from 'react';
import { NetworkEmitter } from './api/network-emitter';

export const NetworkEmitterContext = createContext<NetworkEmitter>(null!);
