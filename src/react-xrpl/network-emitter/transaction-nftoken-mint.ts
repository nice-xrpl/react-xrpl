import {
    getNFTokenID,
    NFTokenMint,
    ResponseOnlyTxInfo,
    TransactionStream,
} from 'xrpl';
import { AddressEvents, WalletEvents } from './types';

export function handleTransactionNFTokenMint(
    addressEvents: Map<string, AddressEvents>,
    tx: TransactionStream,
    transaction: NFTokenMint & ResponseOnlyTxInfo
) {
    const events = addressEvents.get(transaction.Account);

    if (events) {
        console.log(transaction.Account, ' minted a token: ', tx);

        if (tx.meta) {
            events.emitter.emit(
                WalletEvents.TokenMint,
                getNFTokenID(tx.meta) ?? '',
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        }
    }
}
