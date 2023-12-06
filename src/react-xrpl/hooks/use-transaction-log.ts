import { useContext, useEffect, useMemo, useState } from 'react';
import { useStore } from '../stores/use-store';
import { WalletAddressContext } from '../wallet-address-context';
import { useWalletStoreManager } from '../stores/use-wallet-store-manager';
import { useNetworkEmitter } from './use-network-emitter';
import { TransactionLogEntry } from '../api/wallet-types';
import { IssuedCurrencyAmount } from 'xrpl';
import { useXRPLClient } from './use-xrpl-client';
import { WalletEvent } from '../api/network-emitter';
import {
    getTransactions,
    processTransactions,
} from '../api/requests/get-transactions';
import { useIsConnected } from './use-is-connected';

// TODO: for now, storing transaction log in hook rather than in store.  refactor/rethink this if it makes sense (upside is that every use of useTransactionLog can have a different limit of transactions).

function useTransactionLogInternal(account: string, limit: number = 10) {
    const walletManager = useWalletStoreManager();
    const client = useXRPLClient();
    const isConnected = useIsConnected();

    // const store = walletManager.transactionLog.getStore(account);
    const networkEmitter = useNetworkEmitter();

    // const storeLog = useStore(store);
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
                };
                let next = [entry, ...prev];

                if (next.length > limit) {
                    next.splice(next.length - 1, 1);
                }
                return next;
            });
        };

        const emitter = networkEmitter.getEmitter(account);

        if (isConnected) {
            networkEmitter.addAddress(account);

            emitter?.on(WalletEvent.PaymentSent, onPaymentSent);
            emitter?.on(WalletEvent.PaymentRecieved, onPaymentRecieved);
            emitter?.on(WalletEvent.CurrencySent, onCurrencySent);
            emitter?.on(WalletEvent.CurrencyRecieved, onCurrencyRecieved);
        }

        return () => {
            emitter?.off(WalletEvent.PaymentSent, onPaymentSent);
            emitter?.off(WalletEvent.PaymentRecieved, onPaymentRecieved);
            emitter?.off(WalletEvent.CurrencySent, onCurrencySent);
            emitter?.off(WalletEvent.CurrencyRecieved, onCurrencyRecieved);

            walletManager.transactionLog.releaseStore(account);

            if (isConnected) {
                networkEmitter.removeAddress(account);
            }
        };
    }, [account]);

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
