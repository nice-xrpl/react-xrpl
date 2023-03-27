import { useEffect, useMemo, useState } from "react";
import { Client as xrplClient } from "xrpl";
import { Networks } from "./constants";
import { ClientStoreProvider, ClientStores, XRPLClientProvider } from "./client-provider";
import { createStore } from "./stores/create-store";

export function XRPLClient({children, network = Networks.Testnet}: {children: React.ReactNode, network?: string}) {
	const client = useMemo(() => {
		return new xrplClient(network);
	}, [network]);

	const [clientStore] = useState<ClientStores>(() => {
		return {
			connected: createStore<boolean>(false)
		};
	});

	useEffect(() => {
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
			client.off('connected', onConnected);
			client.off('disconnected', onDisconnected);

			client.disconnect();
		}
	}, [client]);

	return (
		<XRPLClientProvider client={client}>
			<ClientStoreProvider state={clientStore}>
				{children}
			</ClientStoreProvider>
		</XRPLClientProvider>
	)
}