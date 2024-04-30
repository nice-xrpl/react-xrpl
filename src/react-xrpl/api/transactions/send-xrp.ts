import {
    Client as xrplClient,
    isValidAddress,
    Wallet as xrplWallet,
    xrpToDrops,
} from 'xrpl';

/**
 * Sends XRP from one wallet to a destination address.
 *
 * @param {xrplClient} client - The XRPL client used to send the transaction.
 * @param {xrplWallet} wallet - The wallet initiating the transaction.
 * @param {string} destinationAddress - The destination address for the payment.
 * @param {number} amount - The amount of XRP to be sent.
 * @return {Promise<TxResponse>} A Promise that resolves with the result of the transaction submission.
 * @throws {string} 'Invalid destination address' if the destination address is invalid.
 * @throws {string} 'Source and destination addresses are the same' if the source and destination addresses are the same.
 */
export async function sendXRP(
    client: xrplClient,
    wallet: xrplWallet,
    destinationAddress: string,
    amount: number
) {
    await client.connect();

    if (!isValidAddress(destinationAddress)) {
        return Promise.reject('Invalid destination address');
    }

    if (wallet.address === destinationAddress) {
        return Promise.reject('Source and destination addresses are the same');
    }

    const tx = await client.submitAndWait(
        {
            TransactionType: 'Payment',
            Account: wallet.address,
            Amount: xrpToDrops(amount),
            Destination: destinationAddress,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return tx;
}
