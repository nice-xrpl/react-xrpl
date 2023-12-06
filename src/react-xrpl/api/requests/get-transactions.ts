import { AccountTxResponse, Client } from 'xrpl';
import { isIssuedCurrency } from 'xrpl/dist/npm/models/transactions/common';
import { TransactionLogEntry } from '../wallet-types';

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

export function processTransactions(
    response: AccountTxResponse,
    address: string
) {
    let initialTransactions: TransactionLogEntry[] = [];

    for (const transaction of response.result.transactions) {
        let tx = transaction.tx;

        if (tx?.TransactionType === 'Payment') {
            // console.log('parsing tx: ', tx);

            if (isIssuedCurrency(tx.Amount)) {
                // amount is currency, not xrp
                if (tx.Destination === address) {
                    initialTransactions.push({
                        type: 'CurrencyReceived',
                        from: tx.Account,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                    });
                }

                if (tx.Account === address) {
                    initialTransactions.push({
                        type: 'CurrencySent',
                        to: tx.Destination,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                    });
                }
            } else {
                if (tx.Destination === address) {
                    initialTransactions.push({
                        type: 'PaymentReceived',
                        from: tx.Account,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                    });
                }

                if (tx.Account === address) {
                    initialTransactions.push({
                        type: 'PaymentSent',
                        to: tx.Destination,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                    });
                }
            }
        }
    }

    return initialTransactions;
}
