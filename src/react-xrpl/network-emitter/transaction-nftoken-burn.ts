import { NFTokenBurn, ResponseOnlyTxInfo, TransactionStream } from 'xrpl';
import { AddressEvents, WalletEvents } from './types';

export function handleTransactionNFTokenBurn(
    addressEvents: Map<string, AddressEvents>,
    tx: TransactionStream,
    transaction: NFTokenBurn & ResponseOnlyTxInfo
) {
    const events = addressEvents.get(transaction.Account);

    if (events) {
        console.log(transaction.Account, ' burned a token: ', tx);

        if (tx.meta) {
            events.emitter.emit(
                WalletEvents.TokenBurn,
                transaction.NFTokenID ?? '',
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        }
    }
}
