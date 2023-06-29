import { createContext } from 'react';
import { ClientStores } from './client-types';

type ClientStoreProviderProps = {
    state: ClientStores;
    children: React.ReactNode;
};

export const ClientStoreContext = createContext<ClientStores>(null!);

export function ClientStoreProvider({
    state,
    children,
}: ClientStoreProviderProps) {
    return (
        <ClientStoreContext.Provider value={state}>
            {children}
        </ClientStoreContext.Provider>
    );
}
