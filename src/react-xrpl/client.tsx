import { useEffect, useMemo, useState } from 'react';
import { Client as xrplClient } from 'xrpl';
import { Networks } from './constants';
import { XRPLClientContext } from './client-context';
import { createStore } from './stores/create-store';
import { ClientStores } from './client-types';
import { ClientStoreContext } from './client-store-context';
import {
    WalletStoreManager,
    WalletStoreManagerProvider,
} from './stores/wallet-store-manager';
import { NetworkEmitter } from './network-emitter';

export function XRPLClient({
    children,
    network = Networks.Testnet,
}: {
    children: React.ReactNode;
    network?: string;
}) {
    const client = useMemo(() => {
        return new xrplClient(network);
    }, [network]);

    const [clientStore] = useState<ClientStores>(() => {
        return {
            connected: createStore<boolean>(false),
        };
    });

    useEffect(() => {
        console.log('connecting...');
        client.connect();

        const onConnected = () => {
            console.log('connected');
            clientStore.connected.setState(true);
        };

        const onDisconnected = () => {
            console.log('disconnected');
            clientStore.connected.setState(false);
        };

        client.on('connected', onConnected);
        client.on('disconnected', onDisconnected);

        return () => {
            console.log('disconnecting...');
            clientStore.connected.setState(false);

            client.off('connected', onConnected);
            client.off('disconnected', onDisconnected);

            client.disconnect();
        };
    }, [client]);

    return (
        <XRPLClientContext.Provider value={client}>
            <ClientStoreContext.Provider value={clientStore}>
                <WalletStoreManagerProvider>
                    <NetworkEmitter>{children}</NetworkEmitter>
                </WalletStoreManagerProvider>
            </ClientStoreContext.Provider>
        </XRPLClientContext.Provider>
    );
}
