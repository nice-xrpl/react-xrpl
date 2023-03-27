import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

export async function burnToken(client: xrplClient, wallet: xrplWallet, tokenID: string) {
	await client.connect();

	const result = await client.submitAndWait({
		TransactionType: 'NFTokenBurn',
		Account: wallet.address,
		NFTokenID: tokenID
	}, {
		autofill: true,
		wallet
	});

	return result;
}