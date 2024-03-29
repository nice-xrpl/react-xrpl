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
    [WalletEvents.BalanceChange]: (balance: string, xrp: number) => void;
    [WalletEvents.PaymentSent]: (
        to: string,
        xrp: string,
        timestamp: number
    ) => void;
    [WalletEvents.PaymentRecieved]: (
        from: string,
        xrp: string,
        timestamp: number
    ) => void;
    [WalletEvents.CurrencyChange]: () => void;
    [WalletEvents.CurrencySent]: (
        to: string,
        amount: IssuedCurrencyAmount,
        timestamp: number
    ) => void;
    [WalletEvents.CurrencyRecieved]: (
        from: string,
        amount: IssuedCurrencyAmount,
        timestamp: number
    ) => void;
    [WalletEvents.TokenMint]: (token?: string) => void;
    [WalletEvents.TokenBurn]: (token?: string) => void;
    [WalletEvents.CreateBuyOffer]: (
        ledgerIndex: string,
        token: string,
        amount: Amount,
        timestamp: number,
    ) => void;
    [WalletEvents.CreateSellOffer]: (
        ledgerIndex: string,
        token: string,
        amount: Amount,
        timestamp: number,
    ) => void;
    [WalletEvents.CancelBuyOffer]: () => void;
    [WalletEvents.CancelSellOffer]: () => void;
    [WalletEvents.AcceptBuyOffer]: (
        buyOfferId: string, 
        token: string, 
        timestamp: number
    ) => void;
    [WalletEvents.AcceptSellOffer]: (
        sellOfferId: string,
        token: string,
        timestamp: number,
    ) => void;
    [WalletEvents.TransferToken]: () => void;
    [WalletEvents.RefreshTokens]: () => void;
};

export type WalletEvent = keyof EventMap;

type AddressEvents = {
    emitter: EventEmitter<EventMap>;
    refCount: number;
};

function processNodes(
    nodes: Node[],
    addressEvents: Map<string, AddressEvents>
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
                            dropsToXrp(balance)
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
                            dropsToXrp(balance)
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
    private _globalEvents: EventEmitter<EventMap>;
    private _eventsEnabled: boolean = false;

    constructor(client: xrplClient) {
        console.log('constructing new network emitter...');

        this._addressEvents = new Map<string, AddressEvents>();
        this._globalEvents = new EventEmitter<EventMap>();
        this._client = client;
    }

    public async start() {
        if (!this._eventsEnabled) {
            console.log('starting transaction stream...');
            this._client.on('transaction', this.onTransaction);

            this._eventsEnabled = true;
        }
    }

    public async stop() {
        if (this._eventsEnabled) {
            console.log('stopping transaction stream...');
            this._client.off('transaction', this.onTransaction);

            this._eventsEnabled = false;
            // this._addressEvents.clear();
        }
    }

    // addAddress starts emitting events based on blockchain transactions for address
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

    // TODO: use meta and AffectedNodes to check final balances on payments/tokens/currencies?
    private onTransaction = (tx: TransactionStream) => {
        console.group('transaction started: ', tx);

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
                        getNFTokenID(tx.meta)
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
                        tx.transaction.NFTokenID
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
                        tx.transaction.date ?? 0
                    );
                } else {
                    destinationEvents.emitter.emit(
                        WalletEvents.PaymentRecieved,
                        tx.transaction.Account,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0
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
                        tx.transaction.date ?? 0
                    );
                } else {
                    sourceEvents.emitter.emit(
                        WalletEvents.PaymentSent,
                        tx.transaction.Destination,
                        tx.transaction.Amount,
                        tx.transaction.date ?? 0
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
                    );
                }
            }
        }

        if (tx.meta?.AffectedNodes) {
            processNodes(tx.meta.AffectedNodes, this._addressEvents);
        }

        console.groupEnd();
    };

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

    public off<T extends WalletEvent>(
        address: string,
        event: T,
        callback: EventMap[T]
    ) {
        this.removeAddress(address);
        this._addressEvents.get(address)?.emitter.off(event, callback);
    }
}

export function createNetworkEmitter(client: xrplClient) {
    return new NetworkEmitter(client);
}
