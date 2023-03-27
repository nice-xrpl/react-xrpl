import { useCallback, useRef } from "react";
import { Offer } from "../../api";
import { getSellOffers } from "../../api/requests";
import { useXRPLClient } from "../use-xrpl-client";

export function useGetSellOffers() {
	const client = useXRPLClient();
	const clientRef = useRef(client);
	clientRef.current = client;
	
	const send = useCallback(async (tokenId: string): Promise<Offer[]> => {
		const result = await getSellOffers(clientRef.current, tokenId);

		return result;
	}, []);

	return send;
}