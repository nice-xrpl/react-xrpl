import {
    encodeAccountID,
    isCreatedNode,
    isDeletedNode,
    isModifiedNode,
    Node,
} from 'xrpl';
import { hexToUInt8Array } from './hex-to-uint8-array';

/**
 * Extracts accounts from NFTokenPage nodes.
 *
 * @param {Node[]} nodes - An array of nodes to extract accounts from.
 * @return {any[]} An array of extracted accounts.
 */
export function extractAccountsFromNFTokenPage(nodes: Node[]) {
    let accounts = [];

    for (const node of nodes) {
        if (isModifiedNode(node)) {
            if (node.ModifiedNode.LedgerEntryType === 'NFTokenPage') {
                const ledgerIndex = node.ModifiedNode.LedgerIndex;
                const account = encodeAccountID(
                    hexToUInt8Array(ledgerIndex.substring(0, 40))
                );

                accounts.push(account);
            }
        }

        if (isCreatedNode(node)) {
            if (node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
                const ledgerIndex = node.CreatedNode.LedgerIndex;
                const account = encodeAccountID(
                    hexToUInt8Array(ledgerIndex.substring(0, 40))
                );

                accounts.push(account);
            }
        }

        if (isDeletedNode(node)) {
            if (node.DeletedNode.LedgerEntryType === 'NFTokenPage') {
                const ledgerIndex = node.DeletedNode.LedgerIndex;
                const account = encodeAccountID(
                    hexToUInt8Array(ledgerIndex.substring(0, 40))
                );

                accounts.push(account);
            }
        }
    }

    return accounts;
}
