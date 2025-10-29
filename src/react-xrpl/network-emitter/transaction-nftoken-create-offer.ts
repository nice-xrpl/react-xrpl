import {
    NFTokenCreateOffer,
    ResponseOnlyTxInfo,
    TransactionStream,
} from 'xrpl';
import { AddressEvents, WalletEvents } from './types';
import { findLedgerIndexForCreatedOffer } from './find-ledger-index-for-offers';

export function handleTransactionNFTokenCreateOffer(
    addressEvents: Map<string, AddressEvents>,
    tx: TransactionStream,
    transaction: NFTokenCreateOffer & ResponseOnlyTxInfo
) {
    const sellerEvents = addressEvents.get(transaction.Account);

    const buyerEvents = transaction.Owner
        ? addressEvents.get(transaction.Owner)
        : undefined;

    if (sellerEvents) {
        if (transaction.Flags === 1) {
            // created a sell offer - only possibly by token owner
            const ledgerIndex = findLedgerIndexForCreatedOffer(
                tx.meta?.AffectedNodes || []
            );
            sellerEvents.emitter.emit(
                WalletEvents.CreateSellOffer,
                ledgerIndex,
                transaction.NFTokenID,
                transaction.Amount,
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        }
    }

    if (buyerEvents) {
        if (transaction.Flags !== 1) {
            // buyer offer created - only emit for the owner of the token
            const ledgerIndex = findLedgerIndexForCreatedOffer(
                tx.meta?.AffectedNodes || []
            );
            buyerEvents.emitter.emit(
                WalletEvents.CreateBuyOffer,
                ledgerIndex,
                transaction.NFTokenID,
                transaction.Amount,
                transaction.date ?? 0,
                transaction.hash ?? ''
            );
        }
    }
}
