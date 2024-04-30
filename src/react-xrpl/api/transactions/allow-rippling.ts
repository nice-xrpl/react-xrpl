import {
    Client as xrplClient,
    Wallet as xrplWallet,
    AccountSetAsfFlags,
    Transaction,
} from 'xrpl';

/**
 * Sets or clears the default ripple flag for a given XRPL wallet.
 *
 * @param {xrplClient} client - The XRPL client to use for connecting to the network.
 * @param {xrplWallet} wallet - The XRPL wallet to modify.
 * @param {boolean} rippling - Whether to set or clear the default ripple flag.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export async function allowRippling(
    client: xrplClient,
    wallet: xrplWallet,
    rippling: boolean
) {
    await client.connect();

    let tx: Transaction = {
        TransactionType: 'AccountSet',
        Account: wallet.address,
    };

    if (rippling) {
        tx.SetFlag = AccountSetAsfFlags.asfDefaultRipple;
    } else {
        tx.ClearFlag = AccountSetAsfFlags.asfDefaultRipple;
    }

    const result = await client.submitAndWait(tx, {
        autofill: true,
        wallet,
    });

    return result;
}
