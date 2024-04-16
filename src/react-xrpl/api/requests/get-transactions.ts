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
    response: AccountTxResponse | AccountTxResponse[]
) {
    let initialTransactions: TransactionLogEntry[] = [];
    let responses = Array.isArray(response) ? response : [response];

    // Flatten all transactions from all responses into a single array
    let allEntries = responses.flatMap((resp) =>
        resp.result.transactions.map((tx) => ({
            account: resp.result.account,
            transaction: tx,
        }))
    );

    // Sort the transactions by the 'date' property
    allEntries.sort((a, b) => {
        let dateA = a.transaction.tx?.date ?? 0;
        let dateB = b.transaction.tx?.date ?? 0;

        return dateA - dateB;
    });

    for (const entry of allEntries) {
        let tx = entry.transaction.tx;

        console.log(entry.account, 'parsing tx: ', entry);

        if (
            tx?.TransactionType === 'NFTokenCreateOffer' &&
            typeof entry.transaction.meta !== 'string'
        ) {
            if (tx?.Flags === 1) {
                initialTransactions.push({
                    type: 'CreateSellOffer',
                    payload: {
                        token: tx.NFTokenID,
                        // @ts-expect-error
                        offerId: entry.transaction.meta.offer_id,
                    },
                    timestamp: tx.date ?? 0,
                });
            }
        }

        if (
            tx?.TransactionType === 'NFTokenAcceptOffer' &&
            typeof entry.transaction.meta !== 'string'
        ) {
            if (tx?.NFTokenSellOffer && tx?.Account === entry.account) {
                initialTransactions.push({
                    type: 'AcceptSellOffer',
                    payload: {
                        // @ts-expect-error
                        token: entry.transaction.meta.nftoken_id,
                        offerId: tx.NFTokenSellOffer,
                    },
                    timestamp: tx.date ?? 0,
                });
            }
        }

        if (
            tx?.TransactionType === 'NFTokenBurn' &&
            typeof entry.transaction.meta !== 'string' &&
            tx.Account === entry.account
        ) {
            initialTransactions.push({
                type: 'TokenBurn',
                payload: {
                    token: tx.NFTokenID,
                },
                timestamp: tx.date ?? 0,
            });
        }

        if (
            tx?.TransactionType === 'NFTokenMint' &&
            typeof entry.transaction.meta !== 'string' &&
            tx.Account === entry.account
        ) {
            initialTransactions.push({
                type: 'TokenMint',
                payload: {
                    // @ts-expect-error
                    token: entry.transaction.meta.nftoken_id,
                },
                timestamp: tx.date ?? 0,
            });
        }

        if (tx?.TransactionType === 'Payment') {
            // console.log('parsing tx: ', tx);

            if (isIssuedCurrency(tx.Amount)) {
                // amount is currency, not xrp
                if (tx.Destination === entry.account) {
                    initialTransactions.push({
                        type: 'CurrencyReceived',
                        from: tx.Account,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                        account: tx.Destination,
                    });
                }

                if (tx.Account === entry.account) {
                    initialTransactions.push({
                        type: 'CurrencySent',
                        to: tx.Destination,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                        account: tx.Account,
                    });
                }
            } else {
                if (tx.Destination === entry.account) {
                    initialTransactions.push({
                        type: 'PaymentReceived',
                        from: tx.Account,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                        account: tx.Destination,
                    });
                }

                if (tx.Account === entry.account) {
                    initialTransactions.push({
                        type: 'PaymentSent',
                        to: tx.Destination,
                        payload: {
                            amount: tx.Amount,
                        },
                        timestamp: tx.date ?? 0,
                        account: tx.Account,
                    });
                }
            }
        }
    }

    return initialTransactions;
}
