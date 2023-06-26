import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

export async function acceptBuyOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenOfferId: string
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenAcceptOffer',
            Account: wallet.address,
            NFTokenBuyOffer: tokenOfferId,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
