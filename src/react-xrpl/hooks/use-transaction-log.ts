import { useContext, useEffect, useMemo, useState } from 'react';
import { WalletAddressContext } from '../wallet-address-context';
import { useNetworkEmitter } from './use-network-emitter';
import { TransactionLogEntry } from '../api/wallet-types';
import { IssuedCurrencyAmount } from 'xrpl';
import { useXRPLClient } from './use-xrpl-client';
import { WalletEvents } from '../api/network-emitter';
import {
    getTransactions,
    processTransactions,
} from '../api/requests/get-transactions';
import { useIsConnected } from './use-is-connected';

function useTransactionLogInternal(account: string, limit: number = 10) {
    const client = useXRPLClient();
    const isConnected = useIsConnected();

    const networkEmitter = useNetworkEmitter();

    const [log, setLog] = useState<TransactionLogEntry[]>(() => {
        return [];
    });

    useEffect(() => {
        // TODO: Fix this for HMR
        if (isConnected && client.isConnected()) {
            getTransactions(client, account, limit)
                .then((response) => {
                    setLog(processTransactions(response, account));
                })
                .catch((error) => {
                    console.log('error: ', error);
                    setLog([]);
                });
        }
    }, [account, client, isConnected]);

    useEffect(() => {
        const onPaymentSent = (to: string, xrp: string, timestamp: number) => {
            setLog((prev) => {
                let entry: TransactionLogEntry = {
                    type: 'PaymentSent',
                    payload: {
                        amount: xrp,
                    },
                    timestamp,
                    to,
                    account,
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
            timestamp: number
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
            timestamp: number
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
            timestamp: number
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
                };
                let next = [entry, ...prev];

                if (next.length > limit) {
                    next.splice(next.length - 1, 1);
                }
                return next;
            });
        };

        if (!isConnected) {
            return;
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

        return () => {
            onPaymentSentOff();
            onPaymentRecievedOff();
            onCurrencySentOff();
            onCurrencyRecievedOff();
        };
    }, [account, isConnected]);

    return log;
}

export function useTransactionLog(account?: string, limit?: number) {
    const address = useContext(WalletAddressContext);

    const accountsInternal = useMemo(() => {
        if (address && !account) {
            // useTransactionLog()
            return address;
        }

        if (typeof account === 'string') {
            // useTransactionLog(account)
            return account;
        }

        return '';
    }, [address]);

    return useTransactionLogInternal(accountsInternal, limit);
}
