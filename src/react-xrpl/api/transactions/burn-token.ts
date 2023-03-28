import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

export async function burnToken(client: xrplClient, wallet: xrplWallet, tokenID: string = '') {
	await client.connect();

	if (tokenID.length !== 64) {
		return Promise.reject('Invalid tokenID');
	}

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