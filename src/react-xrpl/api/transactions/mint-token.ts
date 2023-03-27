import { Client as xrplClient, Wallet as xrplWallet, convertStringToHex } from 'xrpl';

export async function mintToken(client: xrplClient, wallet: xrplWallet, url: string, transferFee: number, flags: number = 8, taxon: number = 0) {
	await client.connect();

	const result = await client.submitAndWait({
		TransactionType: "NFTokenMint",
		Account: wallet.address,
		URI: convertStringToHex(url),
		Flags: flags,
		TransferFee: transferFee,
		NFTokenTaxon: taxon
	}, {
		autofill: true,
		wallet
	});

	return result;
}