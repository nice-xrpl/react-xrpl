import {
    Client as xrplClient,
    Wallet as xrplWallet,
    isoTimeToRippleTime,
} from 'xrpl';

export async function createBuyOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenId: string,
    amount: string,
    {
        expiration,
        targetAddress,
    }: {
        expiration?: Date;
        flags?: number;
        targetAddress?: string;
    }
) {
    await client.connect();

    const result = await client.submitAndWait(
        {
            TransactionType: 'NFTokenCreateOffer',
            Account: wallet.address,
            NFTokenID: tokenId,
            Amount: amount,
            Expiration: expiration
                ? isoTimeToRippleTime(expiration)
                : undefined,
            Destination: targetAddress ? targetAddress : undefined,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
