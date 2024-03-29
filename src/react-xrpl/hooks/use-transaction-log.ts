import { useContext, useEffect, useMemo, useState } from 'react';
import { useStore } from '../stores/use-store';
import { WalletAddressContext } from '../wallet-address-context';
import { useWalletStoreManager } from '../stores/use-wallet-store-manager';
import { useNetworkEmitter } from './use-network-emitter';
import { TransactionLogEntry } from '../api/wallet-types';
import { Amount, IssuedCurrencyAmount } from 'xrpl';
import { useXRPLClient } from './use-xrpl-client';
import { WalletEvents } from '../api/network-emitter';
import {
    getTransactions,
    processTransactions,
} from '../api/requests/get-transactions';
import { useIsConnected } from './use-is-connected';

// TODO: for now, storing transaction log in hook rather than in store.  refactor/rethink this if it makes sense (upside is that every use of useTransactionLog can have a different limit of transactions).

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

        const onCreateSellOffer = (ledgerIndex: string, token: string, amount: Amount, timestamp: number) => {
            setLog((prev) => {
                let entry: TransactionLogEntry = {
                    type: 'CreateSellOffer',
                    payload: {
                        token,
                        offerId: ledgerIndex
                    },
                    timestamp,
                };
                let next = [entry, ...prev];

                if (next.length > limit) {
                    next.splice(next.length - 1, 1);
                }
                return next;
            });
        };

        const onAcceptSellOffer = (sellOfferId: string, token: string, timestamp: number) => {
            setLog((prev) => {
                let entry: TransactionLogEntry = {
                    type: 'AcceptSellOffer',
                    payload: {
                        token,
                        offerId: sellOfferId
                    },
                    timestamp,
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

        return () => {
            onPaymentSentOff();
            onPaymentRecievedOff();
            onCurrencySentOff();
            onCurrencyRecievedOff();
            onCreateSellOfferOff();
            onAcceptSellOfferOff();
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
