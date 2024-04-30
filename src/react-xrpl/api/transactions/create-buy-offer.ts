import {
    Client as xrplClient,
    Wallet as xrplWallet,
    isoTimeToRippleTime,
} from 'xrpl';

/**
 * Creates a buy offer on the XRP Ledger network.
 *
 * @param {xrplClient} client - the XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - the wallet used to sign and submit the transaction.
 * @param {string} owner - the address of the owner of the token.
 * @param {string} tokenId - the ID of the token.
 * @param {string} amount - the amount of the token to be bought.
 * @param {Object} options - additional options for the buy offer.
 * @param {Date} options.expiration - the expiration date of the buy offer.
 * @param {number} options.flags - the flags for the buy offer.
 * @param {string} options.destination - the destination address for the bought tokens.
 * @return {Promise<any>} a promise that resolves with the result of the transaction submission.
 */
export async function createBuyOffer(
    client: xrplClient,
    wallet: xrplWallet,
    owner: string,
    tokenId: string,
    amount: string,
    {
        expiration,
        flags,
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
            Owner: owner,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
