import { Client as xrplClient } from 'xrpl';

export async function getXRPBalance(client: xrplClient,address: string) {
	await client.connect();

	return await client.getXrpBalance(address);
}