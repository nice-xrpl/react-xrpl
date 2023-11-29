import { Client } from 'xrpl';

export async function getTransactions(
    client: Client,
    account: string,
    limit?: number
) {
    const response = await client.request({
        command: 'account_tx',
        account,
        ledger_index_max: -1,
        limit,
    });

    console.log('ACCOUNT TX: ', response);

    return response;
}
