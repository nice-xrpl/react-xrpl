import { isDeletedNode, Node } from 'xrpl';

/**
 * Finds the NFTokenID for a specific offer index in the given array of nodes.
 *
 * @param {string} offerIndex - The index of the offer to search for.
 * @param {Node[]} nodes - An array of nodes to search through.
 * @return {string} The NFTokenID of the offer if found, otherwise an empty string.
 */
export function findNFTokenIDForOffer(offerIndex: string, nodes: Node[]) {
    for (const node of nodes) {
        if (isDeletedNode(node)) {
            if (
                node.DeletedNode.LedgerEntryType === 'NFTokenOffer' &&
                node.DeletedNode.LedgerIndex === offerIndex
            ) {
                return node.DeletedNode.FinalFields.NFTokenID as string;
            }
        }
    }

    return '';
}
