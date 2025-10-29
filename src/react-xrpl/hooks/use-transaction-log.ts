import { useContext, useEffect, useMemo, useState } from 'react';
import { WalletAddressContext } from '../wallet-address-context';
import { useNetworkEmitter } from './use-network-emitter';
import { TransactionLogEntry } from '../api/wallet-types';
import { AccountTxResponse, Amount, Client, IssuedCurrencyAmount } from 'xrpl';
import { useXRPLClient } from './use-xrpl-client';
import { WalletEvents } from '../network-emitter/types';
import {
    getTransactions,
    processTransactions,
} from '../api/requests/get-transactions';
import { useIsConnected } from './use-is-connected';

async function getTransactionsForAccounts(
    client: Client,
    accounts: string[],
    limit: number = 10
) {
    return client
        .connect()
        .then(() => {
            return Promise.all(
                accounts.map((a) =>
                    getTransactions(client, a, limit).catch((error) => {
                        console.log('error: ', error);
                        return {} as AccountTxResponse;
                    })
                )
            ).catch((error) => {
                console.log('error: ', error);
                return [] as AccountTxResponse[];
            });
        })
        .then((responses) => {
            return Promise.resolve(processTransactions(responses));
        });
}

/**
 * Retrieves the transaction log for the specified accounts and updates the state with the new log entries.
 *
 * @param {string[]} accounts - The accounts to retrieve the transaction log for.
 * @param {number} [limit=10] - The maximum number of log entries to retrieve.
 * @return {TransactionLogEntry[]} The transaction log for the specified accounts.
 */
function useTransactionLogInternal(
    accounts: string[] = [],
    limit: number = 10
) {
    const client = useXRPLClient();
    const isConnected = useIsConnected();

    const networkEmitter = useNetworkEmitter();

    // const entries = use(getTransactionsForAccounts(client, accounts, limit));
    useEffect(() => {
        let cancelled = false;

        getTransactionsForAccounts(client, accounts, limit).then((entries) => {
            if (cancelled) {
                return;
            }

            setLog(entries);
        });

        return () => {
            cancelled = true;
        };
    }, []);

    const [log, setLog] = useState<TransactionLogEntry[]>(() => {
        return [];
    });

    useEffect(() => {
        // TODO: Clean this up
        const offs = accounts.map((account) => {
            const onPaymentSent = (
                to: string,
                xrp: string,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'PaymentSent',
                        payload: {
                            amount: xrp,
                        },
                        timestamp,
                        to,
                        account,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onPaymentRecieved = (
                from: string,
                xrp: string,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'PaymentReceived',
                        payload: {
                            amount: xrp,
                        },
                        timestamp,
                        from,
                        account,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onCurrencySent = (
                to: string,
                amount: IssuedCurrencyAmount,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'CurrencySent',
                        payload: {
                            amount,
                        },
                        timestamp,
                        to,
                        account,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onCurrencyRecieved = (
                from: string,
                amount: IssuedCurrencyAmount,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'CurrencyReceived',
                        payload: {
                            amount,
                        },
                        timestamp,
                        from,
                        account,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onCreateSellOffer = (
                ledgerIndex: string,
                token: string,
                amount: Amount,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'CreateSellOffer',
                        payload: {
                            token,
                            offerId: ledgerIndex,
                        },
                        timestamp,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onAcceptSellOffer = (
                sellOfferId: string,
                token: string,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'AcceptSellOffer',
                        payload: {
                            token,
                            offerId: sellOfferId,
                        },
                        timestamp,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onTokenMint = (
                token: string,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'TokenMint',
                        payload: {
                            token,
                        },
                        timestamp,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            const onTokenBurn = (
                token: string,
                timestamp: number,
                hash: string
            ) => {
                setLog((prev) => {
                    let entry: TransactionLogEntry = {
                        type: 'TokenBurn',
                        payload: {
                            token,
                        },
                        timestamp,
                        hash,
                    };
                    let next = [entry, ...prev];

                    if (next.length > limit) {
                        next.splice(next.length - 1, 1);
                    }
                    return next;
                });
            };

            if (!isConnected) {
                return () => {};
            }

            const onPaymentSentOff = networkEmitter.on(
                account,
                WalletEvents.PaymentSent,
                onPaymentSent
            );
            const onPaymentRecievedOff = networkEmitter.on(
                account,
                WalletEvents.PaymentRecieved,
                onPaymentRecieved
            );
            const onCurrencySentOff = networkEmitter.on(
                account,
                WalletEvents.CurrencySent,
                onCurrencySent
            );
            const onCurrencyRecievedOff = networkEmitter.on(
                account,
                WalletEvents.CurrencyRecieved,
                onCurrencyRecieved
            );

            const onCreateSellOfferOff = networkEmitter.on(
                account,
                WalletEvents.CreateSellOffer,
                onCreateSellOffer
            );

            const onAcceptSellOfferOff = networkEmitter.on(
                account,
                WalletEvents.AcceptSellOffer,
                onAcceptSellOffer
            );

            const onTokenMintOff = networkEmitter.on(
                account,
                WalletEvents.TokenMint,
                onTokenMint
            );
            const onTokenBurnOff = networkEmitter.on(
                account,
                WalletEvents.TokenBurn,
                onTokenBurn
            );

            return () => {
                onPaymentSentOff();
                onPaymentRecievedOff();
                onCurrencySentOff();
                onCurrencyRecievedOff();
                onCreateSellOfferOff();
                onAcceptSellOfferOff();
                onTokenMintOff();
                onTokenBurnOff();
            };
        });

        return () => {
            offs.forEach((off) => off());
        };
    }, [accounts, isConnected]);

    return log;
}

/**
 * Retrieves the transaction log for the specified accounts and updates the state with the new log entries.
 *
 * @param {string | string[]} [account] - The account(s) to retrieve the transaction log for.
 * @param {number} [limit] - The maximum number of log entries to retrieve.
 * @return {TransactionLogEntry[]} The transaction log for the specified accounts.
 */
export function useTransactionLog(account?: string | string[], limit?: number) {
    const address = useContext(WalletAddressContext);

    const accountsInternal = useMemo(() => {
        if (address && !account) {
            // useTransactionLog()
            return [address];
        }

        if (typeof account === 'string') {
            // useTransactionLog(account)
            return [account];
        }

        if (Array.isArray(account)) {
            // useTransactionLog([account1, account2, ...])
            return account;
        }

        return [];
    }, [address, account]);

    return useTransactionLogInternal(accountsInternal, limit);
}
