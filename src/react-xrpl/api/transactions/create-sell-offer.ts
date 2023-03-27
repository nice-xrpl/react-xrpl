import { Client as xrplClient, Wallet as xrplWallet, isoTimeToRippleTime } from 'xrpl';

export async function createSellOffer(client: xrplClient, wallet: xrplWallet, tokenId: string, amount: string, { expiration, flags = 1, targetAddress }: {
	expiration?: Date,
	flags?: number,
	targetAddress?: string,
}) {
	await client.connect();

	const result = await client.submitAndWait({
		TransactionType: "NFTokenCreateOffer",
		Account: wallet.address,
		NFTokenID: tokenId,
		Flags: flags,
		Amount: amount,
		Expiration: expiration ? isoTimeToRippleTime(expiration) : undefined,
		Destination: targetAddress ? targetAddress : undefined
	}, {
		autofill: true,
		wallet
	});

	return result;
}