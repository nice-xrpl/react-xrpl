import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

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
