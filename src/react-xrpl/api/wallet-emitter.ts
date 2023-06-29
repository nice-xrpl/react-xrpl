import {
    Client as xrplClient,
    TransactionStream,
    Wallet as xrplWallet,
    dropsToXrp,
    getNFTokenID,
    encodeAccountID,
} from 'xrpl';
import { EventEmitter } from 'events';
import { isIssuedCurrency } from 'xrpl/dist/npm/models/transactions/common';
import {
    isCreatedNode,
    isDeletedNode,
    isModifiedNode,
    Node,
} from 'xrpl/dist/npm/models/transactions/metadata';
import { Buffer } from 'buffer';

export const WalletEvent = {
    BalanceChange: 'balance-change',
    CurrencyChange: 'currency-change',
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

// TODO: properly type events
export type WalletEventHandlers = {
    TokenMint: (id: string) => void;
    TokenBurn: (id: string) => void;
    BalanceChange: (drops: string, xrp: number) => void;
};

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

function extractAccountsFromNFTokenPage(nodes: Node[]) {
    let accounts = [];

    for (const node of nodes) {
        if (isModifiedNode(node)) {
            if (node.ModifiedNode.LedgerEntryType === 'NFTokenPage') {
                const ledgerIndex = node.ModifiedNode.LedgerIndex;
                const account = encodeAccountID(
                    Buffer.from(ledgerIndex.substring(0, 40), 'hex')
                );

                accounts.push(account);
            }
        }

        if (isCreatedNode(node)) {
            if (node.CreatedNode.LedgerEntryType === 'NFTokenPage') {
                const ledgerIndex = node.CreatedNode.LedgerIndex;
                const account = encodeAccountID(
                    Buffer.from(ledgerIndex.substring(0, 40), 'hex')
                );

                accounts.push(account);
            }
        }

        if (isDeletedNode(node)) {
            if (node.DeletedNode.LedgerEntryType === 'NFTokenPage') {
                const ledgerIndex = node.DeletedNode.LedgerIndex;
                const account = encodeAccountID(
                    Buffer.from(ledgerIndex.substring(0, 40), 'hex')
                );

                accounts.push(account);
            }
        }
    }

    return accounts;
}

export class WalletEmitter extends EventEmitter {
    private _address: string;
    private _client: xrplClient;

    constructor(address: string, client: xrplClient) {
        super();

        console.log('creating wallet emitter for ', address);

        this._address = address;
        this._client = client;
    }

    private processNodes(nodes: Node[]) {
        for (const node of nodes) {
            if (isModifiedNode(node)) {
                switch (node.ModifiedNode.LedgerEntryType) {
                    case 'AccountRoot': {
                        // balance change on existing account
                        if (
                            node.ModifiedNode.FinalFields?.Balance &&
                            node.ModifiedNode.FinalFields?.Account ===
                                this._address
                        ) {
                            const balance = node.ModifiedNode.FinalFields
                                .Balance as string;

                            this.emit(
                                WalletEvent.BalanceChange,
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
                        if (
                            node.CreatedNode.NewFields?.Balance &&
                            node.CreatedNode.NewFields?.Account ===
                                this._address
                        ) {
                            const balance = node.CreatedNode.NewFields
                                .Balance as string;

                            this.emit(
                                WalletEvent.BalanceChange,
                                balance,
                                dropsToXrp(balance)
                            );
                        }
                        break;
                    }

                    // case 'NFTokenOffer': {
                    //     // offer created
                    //     if (
                    //         node.CreatedNode.NewFields.Owner === this._address
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

    public async start() {
        console.log('starting transaction stream...', this._address);
        this._client.on('transaction', this.onTransaction);

        const response = await this._client.request({
            command: 'subscribe',
            // TODO: either accounts OR streams has to be specified.  each one gives independant events (ex. if accounts is a wallet and streams is transactions, then you will get two independent streams of events, one for accounts and one for streams)
            accounts: [this._address],
            // streams: ['transactions']
        });

        // console.log(this._address, ' response: ', response);
    }

    public async stop() {
        console.log('stopping transaction stream...', this._address);
        this._client.off('transaction', this.onTransaction);

        const response = await this._client.request({
            command: 'unsubscribe',
            // TODO: either accounts OR streams has to be specified.  each one gives independent events (ex. if accounts is a wallet and streams is transactions, then you will get two independent streams of events, one for accounts and one for streams)
            accounts: [this._address],
            // streams: ['transactions']
        });

        // console.log(this._address, ' response: ', response);
    }

    // TODO: use meta and AffectedNodes to check final balances on payments/tokens/currencies?
    private onTransaction = (tx: TransactionStream) => {
        console.group(this._address);
        console.log(tx);

        if (tx.engine_result !== 'tesSUCCESS') {
            console.log('transaction failed');
            console.groupEnd();
            return;
        }

        if (tx.transaction.TransactionType === 'NFTokenMint') {
            if (tx.transaction.Account === this._address) {
                console.log(this._address, ' minted a token: ', tx);
                if (tx.meta) {
                    this.emit(WalletEvent.TokenMint, getNFTokenID(tx.meta));
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenBurn') {
            if (tx.transaction.Account === this._address) {
                console.log(this._address, ' burned a token: ', tx);
                this.emit(WalletEvent.TokenBurn, tx.transaction.NFTokenID);
            }
        }

        if (tx.transaction.TransactionType === 'Payment') {
            if (tx.transaction.Destination === this._address) {
                console.log(this._address, ' received payment: ', tx);

                if (isIssuedCurrency(tx.transaction.Amount)) {
                    this.emit(WalletEvent.CurrencyChange);
                }
            }

            if (tx.transaction.Account === this._address) {
                console.log(this._address, ' sent payment: ', tx);

                if (isIssuedCurrency(tx.transaction.Amount)) {
                    this.emit(WalletEvent.CurrencyChange);
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenAcceptOffer') {
            const accounts = extractAccountsFromNFTokenPage(
                tx.meta?.AffectedNodes || []
            );

            console.log(accounts);
            if (accounts.indexOf(this._address) !== -1) {
                if (tx.transaction.NFTokenSellOffer) {
                    console.log(this._address, ' accepted a sell offer: ', tx);
                    const ledgerIndex = findLedgerIndexForAcceptedOffer(
                        tx.meta?.AffectedNodes || []
                    );

                    this.emit(
                        WalletEvent.AcceptSellOffer,
                        tx.transaction.NFTokenSellOffer
                    );
                }

                if (tx.transaction.NFTokenBuyOffer) {
                    console.log(this._address, ' accepted a buy offer: ', tx);
                    const ledgerIndex = findLedgerIndexForAcceptedOffer(
                        tx.meta?.AffectedNodes || []
                    );

                    this.emit(
                        WalletEvent.AcceptBuyOffer,
                        tx.transaction.NFTokenBuyOffer
                    );
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenCreateOffer') {
            if (tx.transaction.Account === this._address) {
                if (tx.transaction.Flags === 1) {
                    // created a sell offer - only possibly by token owner
                    const ledgerIndex = findLedgerIndexForCreatedOffer(
                        tx.meta?.AffectedNodes || []
                    );
                    this.emit(
                        WalletEvent.CreateSellOffer,
                        ledgerIndex,
                        tx.transaction.NFTokenID,
                        tx.transaction.Amount
                    );
                }
            }

            if (tx.transaction.Owner === this._address) {
                if (tx.transaction.Flags !== 1) {
                    // buyer offer created - only emit for the owner of the token
                    const ledgerIndex = findLedgerIndexForCreatedOffer(
                        tx.meta?.AffectedNodes || []
                    );
                    this.emit(
                        WalletEvent.CreateBuyOffer,
                        ledgerIndex,
                        tx.transaction.NFTokenID,
                        tx.transaction.Amount
                    );
                }
            }
        }

        if (tx.meta?.AffectedNodes) {
            this.processNodes(tx.meta.AffectedNodes);
        }

        console.groupEnd();
    };
}

export function createWalletEventEmitter(client: xrplClient, address: string) {
    const walletEmitter = new WalletEmitter(address, client);

    return walletEmitter;
}
