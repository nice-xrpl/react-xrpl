import { Client as xrplClient, convertHexToString } from 'xrpl';
import { Token } from '../wallet-types';

export async function getTokens(client: xrplClient, address: string) {
	await client.connect();

	// TODO: data is paginated, request must be sent multiple times using the  marker field (nfts.result.marker) - rate limited
	const nfts = await client.request({
		command: 'account_nfts',
		account: address
	});

	let tokens: Token[] = [];

	for (const token of nfts.result.account_nfts) {
		tokens.push({
			flags: token.Flags,
			id: token.NFTokenID,
			issuer: token.Issuer,
			taxon: token.NFTokenTaxon,
			uri: token.URI ? convertHexToString(token.URI) : ''
		});
	}

	return tokens;
}