import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

export async function acceptOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenOfferId: string
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenAcceptOffer',
            Account: wallet.address,
            NFTokenSellOffer: tokenOfferId,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
