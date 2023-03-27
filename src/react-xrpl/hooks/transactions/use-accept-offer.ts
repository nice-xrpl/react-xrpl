import { useCallback, useRef } from "react";
import { TxResponse } from "xrpl";
import { acceptOffer } from "../../api/transactions";
import { useWallet } from "../use-wallet";
import { useXRPLClient } from "../use-xrpl-client";

export function useAcceptOffer() {
	const client = useXRPLClient();
	const clientRef = useRef(client);
	clientRef.current = client;
	
	const wallet = useWallet();
	const walletRef = useRef(wallet);
	walletRef.current = wallet;

	const send = useCallback(async (tokenOfferId: string): Promise<TxResponse> => {
		const result = await acceptOffer(clientRef.current, walletRef.current, tokenOfferId);

		return result;
	}, []);

	return send;
}