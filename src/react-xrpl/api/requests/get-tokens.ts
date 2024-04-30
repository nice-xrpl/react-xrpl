import { Client as xrplClient, convertHexToString } from 'xrpl';
import { Token } from '../wallet-types';

/**
 * Retrieves a list of tokens associated with a given address.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the XRPL network.
 * @param {string} address - The address for which to retrieve the tokens.
 * @return {Promise<Token[]>} A promise that resolves to an array of tokens.
 */
export async function getTokens(client: xrplClient, address: string) {
    await client.connect();

    // TODO: data is paginated, request must be sent multiple times using the  marker field (nfts.result.marker) - rate limited
    const nfts = await client.request({
        command: 'account_nfts',
        account: address,
    });

    let tokens: Token[] = [];

    for (const token of nfts.result.account_nfts) {
        tokens.push({
            flags: token.Flags,
            id: token.NFTokenID,
            issuer: token.Issuer,
            taxon: token.NFTokenTaxon,
            uri: token.URI ? convertHexToString(token.URI) : '',
        });
    }

    return tokens;
}
