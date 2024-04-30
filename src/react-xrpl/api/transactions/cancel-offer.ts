import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

/**
 * Cancels an offer by submitting an NFTokenCancelOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenOfferId - The ID of the offer to be cancelled.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export async function cancelOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenOfferId: string
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenCancelOffer',
            Account: wallet.address,
            NFTokenOffers: [tokenOfferId],
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
