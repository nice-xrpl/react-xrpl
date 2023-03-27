import { useCallback, useRef } from "react";
import { TxResponse } from "xrpl";
import { burnToken } from "../../api/transactions";
import { useWallet } from "../use-wallet";
import { useXRPLClient } from "../use-xrpl-client";

export function useBurnToken() {
	const client = useXRPLClient();
	const clientRef = useRef(client);
	clientRef.current = client;
	
	const wallet = useWallet();
	const walletRef = useRef(wallet);
	walletRef.current = wallet;

	const create = useCallback(async (tokenID: string): Promise<TxResponse> => {
		const result = await burnToken(clientRef.current, walletRef.current, tokenID);

		return result;
	}, []);

	return create;
}