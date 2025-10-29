import {
    dropsToXrp,
    isCreatedNode,
    isDeletedNode,
    isModifiedNode,
    Node,
} from 'xrpl';
import { WalletEvents, AddressEvents } from './types';

export function processNodes(
    nodes: Node[],
    addressEvents: Map<string, AddressEvents>,
    hash: string
) {
    for (const node of nodes) {
        if (isModifiedNode(node)) {
            switch (node.ModifiedNode.LedgerEntryType) {
                case 'AccountRoot': {
                    // balance change on existing account
                    const account = node.ModifiedNode.FinalFields?.Account as
                        | string
                        | undefined;
                    const events = account
                        ? addressEvents.get(account)
                        : undefined;

                    if (node.ModifiedNode.FinalFields?.Balance && events) {
                        const balance = node.ModifiedNode.FinalFields
                            .Balance as string;

                        events.emitter.emit(
                            WalletEvents.BalanceChange,
                            balance,
                            dropsToXrp(balance),
                            hash
                        );
                    }
                    break;
                }

                case 'NFTokenPage': {
                    // ledgerIndex of nftokenpage when modified contains tokens added and removed
                    // const account = encodeAccountID(Buffer.from(ledgerIndex.substring(0, 40), 'hex'));
                    break;
                }

                default: {
                    break;
                }
            }

            continue;
        }

        if (isCreatedNode(node)) {
            switch (node.CreatedNode.LedgerEntryType) {
                case 'AccountRoot': {
                    // balance change on existing account
                    const account = node.CreatedNode.NewFields?.Account as
                        | string
                        | undefined;
                    const events = account
                        ? addressEvents.get(account)
                        : undefined;

                    if (node.CreatedNode.NewFields?.Balance && events) {
                        const balance = node.CreatedNode.NewFields
                            .Balance as string;

                        events.emitter.emit(
                            WalletEvents.BalanceChange,
                            balance,
                            dropsToXrp(balance),
                            hash
                        );
                    }
                    break;
                }

                // case 'NFTokenOffer': {
                //     // offer created
                //     if (
                //         node.CreatedNode.NewFields.Owner === targetAccount
                //     ) {
                //         if (node.CreatedNode.NewFields.Flags === 1) {
                //             // sell offer created
                //             this.emit(
                //                 WalletEvent.CreateSellOffer,
                //                 node.CreatedNode.LedgerIndex,
                //                 node.CreatedNode.NewFields.NFTokenID,
                //                 node.CreatedNode.NewFields.Amount
                //             );
                //         } else {
                //             // buy offer created
                //             this.emit(
                //                 WalletEvent.CreateBuyOffer,
                //                 node.CreatedNode.LedgerIndex,
                //                 node.CreatedNode.NewFields.NFTokenID,
                //                 node.CreatedNode.NewFields.Amount
                //             );
                //         }
                //     }
                // }

                default: {
                    break;
                }
            }

            continue;
        }

        if (isDeletedNode(node)) {
            switch (node.DeletedNode.LedgerEntryType) {
                case 'NFTokenOffer': {
                    // sell offer or buy offer accepted or canceled
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }
}
