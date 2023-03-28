import { Client as xrplClient, isValidAddress, Wallet as xrplWallet, xrpToDrops } from 'xrpl';

export async function sendXRP(client: xrplClient, wallet: xrplWallet, destinationAddress: string, amount: number) {
	await client.connect();

	if (!isValidAddress(destinationAddress)) {
		return Promise.reject('Invalid address');
	}
	
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