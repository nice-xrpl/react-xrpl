import { Client as xrplClient, Wallet as xrplWallet, xrpToDrops } from 'xrpl';

export async function sendXRP(client: xrplClient, wallet: xrplWallet, destinationAddress: string, amount: number) {
	await client.connect();
	
	const tx = await client.submitAndWait({
		TransactionType: 'Payment',
		Account: wallet.address,
		Amount: xrpToDrops(amount),
		Destination: destinationAddress
	}, {
		autofill: true,
		wallet
	});

	return tx;
}