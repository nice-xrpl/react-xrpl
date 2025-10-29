import {
    NFTokenAcceptOffer,
    ResponseOnlyTxInfo,
    TransactionStream,
} from 'xrpl';
import { AddressEvents, WalletEvents } from './types';
import { extractAccountsFromNFTokenPage } from './extract-accounts-from-nftoken-page';
import { findLedgerIndexForAcceptedOffer } from './find-ledger-index-for-offers';
import { findNFTokenIDForOffer } from './find-nftoken-id-for-offer';

export function handleTransactionNFTokenAcceptOffer(
    addressEvents: Map<string, AddressEvents>,
    tx: TransactionStream,
    transaction: NFTokenAcceptOffer & ResponseOnlyTxInfo
) {
    const accounts = extractAccountsFromNFTokenPage(
        tx.meta?.AffectedNodes || []
    );

    // broker account will be in transaction.Account but not in token page
    // check just in case
    if (accounts.indexOf(transaction.Account) === -1) {
        // add broker account to accounts
        accounts.push(transaction.Account);
    }

    console.log(accounts);

    for (const account of accounts) {
        const events = addressEvents.get(account);

        if (events) {
            if (transaction.NFTokenSellOffer) {
                console.log(account, ' accepted a sell offer: ', tx);
                const ledgerIndex = findLedgerIndexForAcceptedOffer(
                    tx.meta?.AffectedNodes || []
                );

                const tokenId = findNFTokenIDForOffer(
                    transaction.NFTokenSellOffer,
                    tx.meta?.AffectedNodes ?? []
                );

                events.emitter.emit(
                    WalletEvents.AcceptSellOffer,
                    transaction.NFTokenSellOffer,
                    tokenId,
                    transaction.date ?? 0,
                    transaction.hash ?? ''
                );
            }

            if (transaction.NFTokenBuyOffer) {
                console.log(account, ' accepted a buy offer: ', tx);
                const ledgerIndex = findLedgerIndexForAcceptedOffer(
                    tx.meta?.AffectedNodes || []
                );

                const tokenId = findNFTokenIDForOffer(
                    transaction.NFTokenBuyOffer,
                    tx.meta?.AffectedNodes ?? []
                );

                events.emitter.emit(
                    WalletEvents.AcceptBuyOffer,
                    transaction.NFTokenBuyOffer,
                    tokenId,
                    transaction.date ?? 0,
                    transaction.hash ?? ''
                );
            }
        }
    }
}
