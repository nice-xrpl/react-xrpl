import {
    Amount,
    IssuedCurrencyAmount,
    TransactionStream,
    dropsToXrp,
    encodeAccountID,
    getNFTokenID,
    Client as xrplClient,
} from 'xrpl';
import { EventEmitter } from 'tseep';
import { isIssuedCurrency } from 'xrpl/dist/npm/models/transactions/common';
import {
    isCreatedNode,
    isDeletedNode,
    isModifiedNode,
    Node,
} from 'xrpl/dist/npm/models/transactions/metadata';

/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * @param {string} hexString - The hexadecimal string to convert.
 * @return {Uint8Array} The converted Uint8Array.
 */
function hexToUInt8Array(hexString: string) {
    if (hexString.length % 2 !== 0) {
        throw new Error('Hex string must have an even number of characters');
    }

    var bytes = new Uint8Array(hexString.length / 2);

    for (var i = 0; i < bytes.length; i++) {
        var byte = hexString.charAt(i * 2) + hexString.charAt(i * 2 + 1);
        bytes[i] = parseInt(byte, 16);
    }

    return bytes;
}

/**
 * Finds the ledger index for a created offer in the given array of nodes.
 *
 * @param {Node[]} nodes - An array of nodes to search through.
 * @return {string} The ledger index of the created offer, or an empty string if not found.
 */
function findLedgerIndexForCreatedOffer(nodes: Node[]) {
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
function findLedgerIndexForAcceptedOffer(nodes: Node[]) {
    for (const node of nodes) {
        if (isDeletedNode(node)) {
            if (node.DeletedNode.LedgerEntryType === 'NFTokenOffer') {
                return node.DeletedNode.LedgerIndex;
            }
        }
    }

    return '';
}

/**
 * Finds the NFTokenID for a specific offer index in the given array of nodes.
 *
 * @param {string} offerIndex - The index of the offer to search for.
 * @param {Node[]} nodes - An array of nodes to search through.
 * @return {string} The NFTokenID of the offer if found, otherwise an empty string.
 */
function findNFTokenIDForOffer(offerIndex: string, nodes: Node[]) {
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

/**
 * Extracts accounts from NFTokenPage nodes.
 *
 * @param {Node[]} nodes - An array of nodes to extract accounts from.
 * @return {any[]} An array of extracted accounts.
 */
function extractAccountsFromNFTokenPage(nodes: Node[]) {
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

export const WalletEvents = {
    BalanceChange: 'balance-change',
    PaymentSent: 'payment-sent',
    PaymentRecieved: 'payment-recieved',
    CurrencyChange: 'currency-change',
    CurrencySent: 'currency-sent',
    CurrencyRecieved: 'currency-recieved',
    TokenMint: 'token-mint',
    TokenBurn: 'token-burn',
    CreateBuyOffer: 'create-buy-offer',
    CreateSellOffer: 'create-sell-offer',
    CancelBuyOffer: 'cancel-buy-offer',
    CancelSellOffer: 'cancel-sell-offer',
    AcceptBuyOffer: 'accept-buy-offer',
    AcceptSellOffer: 'accept-sell-offer',
    TransferToken: 'transfer-token',
    RefreshTokens: 'refresh-tokens',
} as const;

type EventMap = {
    [WalletEvents.BalanceChange]: (
        balance: string,
        xrp: number,
        hash: string
    ) => void;
    [WalletEvents.PaymentSent]: (
        to: string,
        xrp: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.PaymentRecieved]: (
        from: string,
        xrp: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CurrencyChange]: () => void;
    [WalletEvents.CurrencySent]: (
        to: string,
        amount: IssuedCurrencyAmount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CurrencyRecieved]: (
        from: string,
        amount: IssuedCurrencyAmount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.TokenMint]: (
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.TokenBurn]: (
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CreateBuyOffer]: (
        ledgerIndex: string,
        token: string,
        amount: Amount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CreateSellOffer]: (
        ledgerIndex: string,
        token: string,
        amount: Amount,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.CancelBuyOffer]: (hash: string) => void;
    [WalletEvents.CancelSellOffer]: (hash: string) => void;
    [WalletEvents.AcceptBuyOffer]: (
        buyOfferId: string,
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.AcceptSellOffer]: (
        sellOfferId: string,
        token: string,
        timestamp: number,
        hash: string
    ) => void;
    [WalletEvents.TransferToken]: (hash: string) => void;
    [WalletEvents.RefreshTokens]: (hash: string) => void;
};

export type WalletEvent = keyof EventMap;

type AddressEvents = {
    emitter: EventEmitter<EventMap>;
    refCount: number;
};

/**
 * Processes an array of nodes, emitting events for balance changes and offer creations/cancellations.
 *
 * @param {Node[]} nodes - An array of nodes to process.
 * @param {Map<string, AddressEvents>} addressEvents - A map of address events.
 * @param {string} hash - A hash string.
 */
function processNodes(
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

export class NetworkEmitter {
    private _client: xrplClient;
    private _addressEvents: Map<string, AddressEvents>;
    private _eventsEnabled: boolean = false;

    /**
     * Constructor for creating a new network emitter.
     *
     * @param {xrplClient} client - The XRPL client to use for network communication.
     * @return {void} No return value.
     */
    constructor(client: xrplClient) {
        console.log('constructing new network emitter...');

        this._addressEvents = new Map<string, AddressEvents>();
        this._client = client;
    }

    /**
     * Starts the transaction stream if events are not already enabled.
     *
     * @return {Promise<void>} No return value.
     */
    public async start() {
        if (!this._eventsEnabled) {
            console.log('starting transaction stream...');
            this._client.on('transaction', this.onTransaction);

            this._eventsEnabled = true;
        }
    }

    /**
     * Stops the transaction stream if events are currently enabled.
     *
     * @return {Promise<void>} No return value.
     */
    public async stop() {
        if (this._eventsEnabled) {
            console.log('stopping transaction stream...');
            this._client.off('transaction', this.onTransaction);

            this._eventsEnabled = false;
            // this._addressEvents.clear();
        }
    }

    /**
     * Adds an address to the address events map and subscribes to events for that address.
     *
     * @param {string} address - The address to add and subscribe to events for.
     * @return {Promise<void>} No return value.
     */
    private async addAddress(address: string) {
        let events = this._addressEvents.get(address);

        if (events) {
            // update refcount
            events.refCount++;

            return;
        }

        this._addressEvents.set(address, {
            emitter: new EventEmitter<EventMap>(),
            refCount: 1,
        });

        // new ref
        const response = await this._client.request({
            command: 'subscribe',
            // TODO: either accounts OR streams has to be specified.  each one gives independent events (ex. if accounts is a wallet and streams is transactions, then you will get two independent streams of events, one for accounts and one for streams)
            accounts: [address],
            // streams: ['transactions']
        });
    }

    /**
     * Removes an address from the address events map and unsubscribes from events for that address.
     *
     * @param {string} address - The address to remove and unsubscribe from events for.
     * @return {Promise<void>} No return value.
     */
    private async removeAddress(address: string) {
        let events = this._addressEvents.get(address);

        if (events) {
            // update refcount
            events.refCount--;

            if (events.refCount <= 0) {
                // last ref
                events.emitter.removeAllListeners();
                this._addressEvents.delete(address);

                const response = await this._client.request({
                    command: 'unsubscribe',
                    // TODO: either accounts OR streams has to be specified.  each one gives independent events (ex. if accounts is a wallet and streams is transactions, then you will get two independent streams of events, one for accounts and one for streams)
                    accounts: [address],
                    // streams: ['transactions']
                });
            }
        }
    }

    /**
     * Handles a transaction event.
     *
     * @param {TransactionStream} tx - The transaction stream object.
     */
    private onTransaction = (tx: TransactionStream) => {
        console.group('transaction started: ', tx);
        // TODO: use meta and AffectedNodes to check final balances on payments/tokens/currencies?

        if (tx.engine_result !== 'tesSUCCESS') {
            console.log('transaction failed');
            console.groupEnd();
            return;
        }

        if (tx.transaction.TransactionType === 'NFTokenMint') {
            const events = this._addressEvents.get(tx.transaction.Account);

            if (events) {
                console.log(tx.transaction.Account, ' minted a token: ', tx);

                if (tx.meta) {
                    events.emitter.emit(
                        WalletEvents.TokenMint,
                        getNFTokenID(tx.meta) ?? '',
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenBurn') {
            const events = this._addressEvents.get(tx.transaction.Account);

            if (events) {
                console.log(tx.transaction.Account, ' burned a token: ', tx);

                if (tx.meta) {
                    events.emitter.emit(
                        WalletEvents.TokenBurn,
                        tx.transaction.NFTokenID ?? '',
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                }
            }
        }

        if (tx.transaction.TransactionType === 'Payment') {
            const destinationEvents = this._addressEvents.get(
                tx.transaction.Destination
            );
            const sourceEvents = this._addressEvents.get(
                tx.transaction.Account
            );

            if (destinationEvents) {
                console.log(
                    tx.transaction.Destination,
                    ' received payment: ',
                    tx
                );

                if (isIssuedCurrency(tx.transaction.Amount)) {
                    destinationEvents.emitter.emit(WalletEvents.CurrencyChange);
                    destinationEvents.emitter.emit(
                        WalletEvents.CurrencyRecieved,
                        tx.transaction.Account,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                } else {
                    destinationEvents.emitter.emit(
                        WalletEvents.PaymentRecieved,
                        tx.transaction.Account,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                }
            }

            if (sourceEvents) {
                console.log(tx.transaction.Account, ' sent payment: ', tx);

                if (isIssuedCurrency(tx.transaction.Amount)) {
                    sourceEvents.emitter.emit(WalletEvents.CurrencyChange);
                    sourceEvents.emitter.emit(
                        WalletEvents.CurrencySent,
                        tx.transaction.Destination,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                } else {
                    sourceEvents.emitter.emit(
                        WalletEvents.PaymentSent,
                        tx.transaction.Destination,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenAcceptOffer') {
            const accounts = extractAccountsFromNFTokenPage(
                tx.meta?.AffectedNodes || []
            );

            // broker account will be in tx.transaction.Account but not in token page
            // check just in case
            if (accounts.indexOf(tx.transaction.Account) === -1) {
                // add broker account to accounts
                accounts.push(tx.transaction.Account);
            }

            console.log(accounts);

            for (const account of accounts) {
                const events = this._addressEvents.get(account);

                if (events) {
                    if (tx.transaction.NFTokenSellOffer) {
                        console.log(account, ' accepted a sell offer: ', tx);
                        const ledgerIndex = findLedgerIndexForAcceptedOffer(
                            tx.meta?.AffectedNodes || []
                        );

                        const tokenId = findNFTokenIDForOffer(
                            tx.transaction.NFTokenSellOffer,
                            tx.meta?.AffectedNodes ?? []
                        );

                        events.emitter.emit(
                            WalletEvents.AcceptSellOffer,
                            tx.transaction.NFTokenSellOffer,
                            tokenId,
                            tx.transaction.date ?? 0,
                            tx.transaction.hash ?? ''
                        );
                    }

                    if (tx.transaction.NFTokenBuyOffer) {
                        console.log(account, ' accepted a buy offer: ', tx);
                        const ledgerIndex = findLedgerIndexForAcceptedOffer(
                            tx.meta?.AffectedNodes || []
                        );

                        const tokenId = findNFTokenIDForOffer(
                            tx.transaction.NFTokenBuyOffer,
                            tx.meta?.AffectedNodes ?? []
                        );

                        events.emitter.emit(
                            WalletEvents.AcceptBuyOffer,
                            tx.transaction.NFTokenBuyOffer,
                            tokenId,
                            tx.transaction.date ?? 0,
                            tx.transaction.hash ?? ''
                        );
                    }
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenCreateOffer') {
            const sellerEvents = this._addressEvents.get(
                tx.transaction.Account
            );

            const buyerEvents = tx.transaction.Owner
                ? this._addressEvents.get(tx.transaction.Owner)
                : undefined;

            if (sellerEvents) {
                if (tx.transaction.Flags === 1) {
                    // created a sell offer - only possibly by token owner
                    const ledgerIndex = findLedgerIndexForCreatedOffer(
                        tx.meta?.AffectedNodes || []
                    );
                    sellerEvents.emitter.emit(
                        WalletEvents.CreateSellOffer,
                        ledgerIndex,
                        tx.transaction.NFTokenID,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                }
            }

            if (buyerEvents) {
                if (tx.transaction.Flags !== 1) {
                    // buyer offer created - only emit for the owner of the token
                    const ledgerIndex = findLedgerIndexForCreatedOffer(
                        tx.meta?.AffectedNodes || []
                    );
                    buyerEvents.emitter.emit(
                        WalletEvents.CreateBuyOffer,
                        ledgerIndex,
                        tx.transaction.NFTokenID,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0,
                        tx.transaction.hash ?? ''
                    );
                }
            }
        }

        if (tx.meta?.AffectedNodes) {
            processNodes(
                tx.meta.AffectedNodes,
                this._addressEvents,
                tx.transaction.hash ?? ''
            );
        }

        console.groupEnd();
    };

    /**
     * Registers a callback function to be executed when a specific event occurs for a given address.
     *
     * @param {string} address - The address to register the event for.
     * @param {T} event - The event to listen for.
     * @param {EventMap[T]} callback - The callback function to be executed when the event occurs.
     * @return {() => void} A function that can be called to unregister the callback.
     */
    public on<T extends WalletEvent>(
        address: string,
        event: T,
        callback: EventMap[T]
    ) {
        this.addAddress(address);
        this._addressEvents.get(address)?.emitter.on(event, callback);

        return () => {
            this.off(address, event, callback);
        };
    }

    /**
     * Removes a callback function from the event listener for a specific event and address.
     *
     * @param {string} address - The address to remove the event listener from.
     * @param {T} event - The event to remove the listener for.
     * @param {EventMap[T]} callback - The callback function to remove.
     * @return {void} This function does not return anything.
     */
    public off<T extends WalletEvent>(
        address: string,
        event: T,
        callback: EventMap[T]
    ) {
        this.removeAddress(address);
        this._addressEvents.get(address)?.emitter.off(event, callback);
    }
}

/**
 * Creates a new NetworkEmitter instance using the provided xrplClient.
 *
 * @param {xrplClient} client - The xrplClient to be used by the NetworkEmitter.
 * @return {NetworkEmitter} A new instance of NetworkEmitter.
 */
export function createNetworkEmitter(client: xrplClient) {
    return new NetworkEmitter(client);
}
