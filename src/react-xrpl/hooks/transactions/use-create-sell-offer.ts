import { useCallback, useRef } from "react";
import { TxResponse } from "xrpl";
import { createSellOffer } from "../../api/transactions";
import { useWallet } from "../use-wallet";
import { useXRPLClient } from "../use-xrpl-client";

export function useCreateSellOffer() {
	const client = useXRPLClient();
	const clientRef = useRef(client);
	clientRef.current = client;
	
	const wallet = useWallet();
	const walletRef = useRef(wallet);
	walletRef.current = wallet;

	const send = useCallback(async (tokenId: string, amount: string, { expiration, targetAddress, flags }: {
		expiration?: Date | undefined;
		flags?: number | undefined;
		targetAddress?: string | undefined;
	}): Promise<TxResponse> => {
		const result = await createSellOffer(clientRef.current, walletRef.current, tokenId, amount, {
			expiration, targetAddress, flags
		});

		return result;
	}, []);

	return send;
}