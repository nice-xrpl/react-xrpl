import { useContext, useEffect, useMemo } from 'react';
import { useStore } from '../stores/use-store';
import { WalletAddressContext } from '../wallet-address-context';
import { useWalletStoreManager } from '../stores/use-wallet-store-manager';
import { useNetworkEmitter } from './use-network-emitter';
import { TransactionLogEntry } from '../api/wallet-types';
import { IssuedCurrencyAmount } from 'xrpl';

function useTransactionLogInternal(account: string, limit: number = 10) {
    const walletManager = useWalletStoreManager();

    const store = walletManager.transactionLog.getStore(account);
    const networkEmitter = useNetworkEmitter();

    useEffect(() => {
        networkEmitter.addAddress(account);
        const emitter = networkEmitter.getEmitter(account);

        const onPaymentSent = (to: string, xrp: string, timestamp: number) => {
            store.setState((prev) => {
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
            store.setState((prev) => {
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
            store.setState((prev) => {
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
            store.setState((prev) => {
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

        emitter?.on('payment-sent', onPaymentSent);
        emitter?.on('payment-recieved', onPaymentRecieved);
        emitter?.on('currency-sent', onCurrencySent);
        emitter?.on('currency-recieved', onCurrencyRecieved);

        return () => {
            emitter?.off('payment-sent', onPaymentSent);
            emitter?.off('payment-recieved', onPaymentRecieved);
            emitter?.off('currency-sent', onCurrencySent);
            emitter?.off('currency-recieved', onCurrencyRecieved);

            networkEmitter.removeAddress(account);
            walletManager.transactionLog.releaseStore(account);
        };
    }, [account]);

    return useStore(store);
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
