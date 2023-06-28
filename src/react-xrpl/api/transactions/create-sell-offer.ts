import {
    Client as xrplClient,
    Wallet as xrplWallet,
    isoTimeToRippleTime,
} from 'xrpl';

export async function createSellOffer(
    client: xrplClient,
    wallet: xrplWallet,
    tokenId: string,
    amount: string,
    {
        expiration,
        flags = 1,
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
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
