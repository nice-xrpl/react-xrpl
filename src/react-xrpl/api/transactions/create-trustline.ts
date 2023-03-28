import { Client as xrplClient, isValidAddress, Wallet as xrplWallet } from 'xrpl';
import { allowRippling } from './allow-rippling';

export async function createTrustline(client: xrplClient, wallet: xrplWallet, targetWalletAddress: string, currencyCode: string, limit: string) {
	await client.connect();

	if (!isValidAddress(targetWalletAddress)) {
		return Promise.reject('Invalid target address');
	}

	if (wallet.address === targetWalletAddress) {
		return Promise.reject('Source and target addresses are the same')
	}

	const allowRipplingResult = await allowRippling(client, wallet, true);

	const result = await client.submitAndWait({
		TransactionType: 'TrustSet',
		Account: wallet.address,
		LimitAmount: {
			currency: currencyCode,
			issuer: targetWalletAddress,
			value: limit
		}
	}, {
		autofill: true,
		wallet
	});

	return result;
}