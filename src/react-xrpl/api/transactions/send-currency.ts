import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

export async function sendCurrency(client: xrplClient, wallet: xrplWallet, destinationAddress: string, currencyCode: string, amount: string) {
	await client.connect();
	
	const result = await client.submitAndWait({
		TransactionType: 'Payment',
		Account: wallet.address,
		Amount: {
			currency: currencyCode,
			value: amount,
			issuer: wallet.address
		},
		Destination: destinationAddress
	}, {
		autofill: true,
		wallet
	});

	return result;
}