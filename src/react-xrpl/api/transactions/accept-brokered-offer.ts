import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';

export async function acceptBrokeredOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenBuyOfferId: string,
    tokenSellOfferId: string,
    fee: string
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenAcceptOffer',
            Account: wallet.address,
            NFTokenBuyOffer: tokenBuyOfferId,
            NFTokenSellOffer: tokenSellOfferId,
            NFTokenBrokerFee: fee,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
