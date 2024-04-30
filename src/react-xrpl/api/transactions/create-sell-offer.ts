import {
    Client as xrplClient,
    Wallet as xrplWallet,
    isoTimeToRippleTime,
} from 'xrpl';

/**
 * Creates a sell offer on the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client instance.
 * @param {xrplWallet} wallet - The XRPL wallet instance.
 * @param {string} tokenId - The ID of the token being sold.
 * @param {string} amount - The amount of the token being sold.
 * @param {Object} options - Additional options for the sell offer.
 * @param {Date} [options.expiration] - The expiration date of the sell offer.
 * @param {number} [options.flags=1] - Additional flags for the sell offer.
 * @param {string} [options.destination] - The destination address for the sell offer.
 * @return {Promise<TxResponse>} A promise that resolves to the transaction response.
 */
export async function createSellOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenId: string,
    amount: string,
    {
        expiration,
        flags = 1,
        destination,
    }: {
        expiration?: Date;
        flags?: number;
        destination?: string;
    }
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenCreateOffer',
            Account: wallet.address,
            NFTokenID: tokenId,
            Flags: flags,
            Amount: amount,
            Expiration: expiration
                ? isoTimeToRippleTime(expiration)
                : undefined,
            Destination: destination ? destination : undefined,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
