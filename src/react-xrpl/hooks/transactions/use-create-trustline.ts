import { useCallback, useRef } from "react";
import { TxResponse } from "xrpl";
import { createTrustline } from "../../api/transactions";
import { useWallet } from "../use-wallet";
import { useXRPLClient } from "../use-xrpl-client";


export function useCreateTrustline() {
	const client = useXRPLClient();
	const clientRef = useRef(client);
	clientRef.current = client;
	
	const wallet = useWallet();
	const walletRef = useRef(wallet);
	walletRef.current = wallet;	

	const create = useCallback(async (targetWalletAddress: string, currencyCode: string, limit: string): Promise<TxResponse> => {
		const result = await createTrustline(clientRef.current, walletRef.current, targetWalletAddress, currencyCode, limit);

		return result;
	}, []);

	return create;
}