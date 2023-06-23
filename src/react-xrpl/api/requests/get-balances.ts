import { Client as xrplClient } from 'xrpl';

export async function getBalances(client: xrplClient, address: string) {
	await client.connect();

	const balances = await client.getBalances(address);

	return balances;
}