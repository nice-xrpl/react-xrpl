import { useEffect, useMemo, useState } from 'react';
import { Client as xrplClient } from 'xrpl';
import { Networks } from './constants';
import { XRPLClientContext } from './client-context';
import { createStore } from './stores/create-store';
import { ClientStores } from './client-types';
import { ClientStoreContext } from './client-store-context';
import { WalletStoreManagerProvider } from './stores/wallet-store-manager';
import { NetworkEmitter } from './network-emitter';

/**
 * Creates an XRPL client with the specified network and provides it to its children components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the XRPL client.
 * @param {string} [props.network=Networks.Testnet] - The network to connect to. Defaults to Networks.Testnet.
 * @return {JSX.Element} The XRPL client component.
 */
export function XRPLClient({
    children,
    network = Networks.Testnet,
}: {
    children: React.ReactNode;
    network?: string;
}) {
    console.log('rendering client');

    const client = useMemo(() => {
        console.log('creating client in memo: ', network);
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
                <NetworkEmitter>
                    <WalletStoreManagerProvider>
                        {children}
                    </WalletStoreManagerProvider>
                </NetworkEmitter>
            </ClientStoreContext.Provider>
        </XRPLClientContext.Provider>
    );
}
