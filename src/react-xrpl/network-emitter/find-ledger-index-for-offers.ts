import { isCreatedNode, isDeletedNode, Node } from 'xrpl';

/**
 * Finds the ledger index for a created offer in the given array of nodes.
 *
 * @param {Node[]} nodes - An array of nodes to search through.
 * @return {string} The ledger index of the created offer, or an empty string if not found.
 */
export function findLedgerIndexForCreatedOffer(nodes: Node[]) {
    for (const node of nodes) {
        if (isCreatedNode(node)) {
            if (node.CreatedNode.LedgerEntryType === 'NFTokenOffer') {
                return node.CreatedNode.LedgerIndex;
            }
        }
    }

    return '';
}

/**
 * Finds the ledger index for an accepted offer in the given array of nodes.
 *
 * @param {Node[]} nodes - An array of nodes to search through.
 * @return {string} The ledger index of the accepted offer, or an empty string if not found.
 */
export function findLedgerIndexForAcceptedOffer(nodes: Node[]) {
    for (const node of nodes) {
        if (isDeletedNode(node)) {
            if (node.DeletedNode.LedgerEntryType === 'NFTokenOffer') {
                return node.DeletedNode.LedgerIndex;
            }
        }
    }

    return '';
}
