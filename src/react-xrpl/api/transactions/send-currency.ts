import {
    Client as xrplClient,
    isValidAddress,
    Wallet as xrplWallet,
} from 'xrpl';

export async function sendCurrency(
    client: xrplClient,
    wallet: xrplWallet,
    destinationAddress: string,
    currencyCode: string,
    amount: string
) {
    await client.connect();

    if (!isValidAddress(destinationAddress)) {
        return Promise.reject('Invalid destination address');
    }

    if (wallet.address === destinationAddress) {
        return Promise.reject('Source and destination addresses are the same');
    }

    const result = await client.submitAndWait(
        {
            TransactionType: 'Payment',
            Account: wallet.address,
            Amount: {
                currency: currencyCode,
                value: amount,
                issuer: wallet.address,
            },
            Destination: destinationAddress,
        },
        {
            autofill: true,
            wallet,
        }
    );

    return result;
}
