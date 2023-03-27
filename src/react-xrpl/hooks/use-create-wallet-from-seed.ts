import { useCallback, useRef } from "react";
import { XRPLWalletInitialState, createWalletFromSeed } from "../api";
import { useXRPLClient } from "./";

export function useCreateWalletFromSeed() {
	const client = useXRPLClient();
	const clientRef = useRef(client);
	clientRef.current = client;

	const create = useCallback(async (seed: string): Promise<XRPLWalletInitialState> => {
		const result = await createWalletFromSeed(clientRef.current, seed);

		return result;
	}, []);

	return create;
}