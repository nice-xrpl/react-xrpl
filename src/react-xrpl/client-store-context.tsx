import { createContext } from 'react';
import { ClientStores } from './client-types';

export const ClientStoreContext = createContext<ClientStores>(null!);
