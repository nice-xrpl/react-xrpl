import {
    Client as xrplClient,
    Wallet as xrplWallet,
    convertStringToHex,
} from 'xrpl';

/**
 * Function to mint a non-fungible token (NFT).
 *
 * @param {xrplClient} client - The XRPL client to use for the transaction.
 * @param {xrplWallet} wallet - The XRPL wallet to mint the NFT from.
 * @param {string} url - The URL associated with the NFT (optional, defaults to an empty string).
 * @param {number} transferFee - The transfer fee for the transaction (optional, defaults to 0).
 * @param {number} flags - The flags for the transaction (optional, defaults to 8).
 * @param {number} taxon - The taxon for the NFT (optional, defaults to 0).
 * @return {Promise} A promise that resolves with the result of the minting transaction.
 */
export async function mintToken(
    client: xrplClient,
    wallet: xrplWallet,
    url: string = '',
    transferFee: number = 0,
    flags: number = 8,
    taxon: number = 0
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenMint',
            Account: wallet.address,
            URI: convertStringToHex(url),
            Flags: flags,
            TransferFee: transferFee,
            NFTokenTaxon: taxon,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
