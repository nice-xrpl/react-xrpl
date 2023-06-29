import { Client as xrplClient } from 'xrpl';
import { createContext } from 'react';

export const XRPLClientContext = createContext<xrplClient>(null!);

type XRPLClientProps = {
    client: xrplClient;
    children: React.ReactNode;
};

export function XRPLClientProvider({ client, children }: XRPLClientProps) {
    return (
        <XRPLClientContext.Provider value={client}>
            {children}
        </XRPLClientContext.Provider>
    );
}
