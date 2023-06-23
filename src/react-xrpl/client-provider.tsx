import { Client as xrplClient } from 'xrpl';
import { createContext } from 'react';
import { Store } from './stores/create-store';

export const XRPLClientContext = createContext<xrplClient>(null!);

type XRPLClientProps = {
    client: xrplClient;
    children: React.ReactNode;
};

export type ClientStores = {
    connected: Store<boolean>;
};

export function XRPLClientProvider({ client, children }: XRPLClientProps) {
    return (
        <XRPLClientContext.Provider value={client}>
            {children}
        </XRPLClientContext.Provider>
    );
}

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
