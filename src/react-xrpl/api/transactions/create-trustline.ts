import {
    Client as xrplClient,
    isValidAddress,
    Wallet as xrplWallet,
} from 'xrpl';
import { allowRippling } from './allow-rippling';

/**
 * Creates a trustline between two wallets.
 *
 * @param {xrplClient} client - The XRPL client instance.
 * @param {xrplWallet} wallet - The wallet that is creating the trustline.
 * @param {string} targetWalletAddress - The address of the wallet that is receiving the trustline.
 * @param {string} currencyCode - The currency code of the trustline.
 * @param {string} limit - The limit of the trustline.
 * @return {Promise<TxResponse>} A promise that resolves with the transaction response.
 * @throws {Promise<string>} If the target address is invalid or if the source and target addresses are the same.
 */
export async function createTrustline(
    client: xrplClient,
    wallet: xrplWallet,
    targetWalletAddress: string,
    currencyCode: string,
    limit: string
) {
    await client.connect();

    if (!isValidAddress(targetWalletAddress)) {
        return Promise.reject('Invalid target address');
    }

    if (wallet.address === targetWalletAddress) {
        return Promise.reject('Source and target addresses are the same');
    }

    const allowRipplingResult = await allowRippling(client, wallet, true);

    const result = await client.submitAndWait(
        {
            TransactionType: 'TrustSet',
            Account: wallet.address,
            LimitAmount: {
                currency: currencyCode,
                issuer: targetWalletAddress,
                value: limit,
            },
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
