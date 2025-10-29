import {
    dropsToXrp,
    Payment,
    ResponseOnlyTxInfo,
    TransactionStream,
    xrpToDrops,
} from 'xrpl';
import { AddressEvents, WalletEvents } from './types';
import {
    isIssuedCurrency,
    isMPTAmount,
} from 'xrpl/dist/npm/models/transactions/common';

export function handleTransactionPayment(
    addressEvents: Map<string, AddressEvents>,
    tx: TransactionStream,
    transaction: Payment & ResponseOnlyTxInfo
) {
    const destinationEvents = addressEvents.get(transaction.Destination);
    const sourceEvents = addressEvents.get(transaction.Account);

    if (destinationEvents) {
        console.log(transaction.Destination, ' received payment: ', tx);

        if (isIssuedCurrency(transaction.Amount)) {
            destinationEvents.emitter.emit(WalletEvents.CurrencyChange);
            destinationEvents.emitter.emit(
                WalletEvents.CurrencyRecieved,
                transaction.Account,
                transaction.Amount,
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        } else if (isMPTAmount(transaction.Amount)) {
            console.warn('MPT amount is not supported yet');
            console.warn('MPT amount: ', transaction.Amount);
        } else {
            const amount = dropsToXrp(transaction.Amount);

            destinationEvents.emitter.emit(
                WalletEvents.PaymentRecieved,
                transaction.Account,
                `${amount}`,
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        }
    }

    if (sourceEvents) {
        console.log(transaction.Account, ' sent payment: ', tx);

        if (isIssuedCurrency(transaction.Amount)) {
            sourceEvents.emitter.emit(WalletEvents.CurrencyChange);
            sourceEvents.emitter.emit(
                WalletEvents.CurrencySent,
                transaction.Destination,
                transaction.Amount,
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        } else if (isMPTAmount(transaction.Amount)) {
            console.warn('MPT amount is not supported yet');
            console.warn('MPT amount: ', transaction.Amount);
        } else {
            const amount = dropsToXrp(transaction.Amount);
            sourceEvents.emitter.emit(
                WalletEvents.PaymentSent,
                transaction.Destination,
                `${amount}`,
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        }
    }
}
