import {
    Client as xrplClient,
    TransactionStream,
    Wallet as xrplWallet,
    dropsToXrp,
    getNFTokenID,
} from 'xrpl';
import { EventEmitter } from 'events';
import { isIssuedCurrency } from 'xrpl/dist/npm/models/transactions/common';
import {
    isCreatedNode,
    isModifiedNode,
    Node,
} from 'xrpl/dist/npm/models/transactions/metadata';

export const WalletEvent = {
    BalanceChange: 'balance-change',
    CurrencyChange: 'currency-change',
    TokenMint: 'token-mint',
    TokenBurn: 'token-burn',
} as const;

// TODO: properly type events
export type WalletEventHandlers = {
    TokenMint: (id: string) => void;
    TokenBurn: (id: string) => void;
    BalanceChange: (drops: string, xrp: number) => void;
};

function getBalance(account: string, nodes: Node[]) {
    let balance = '';

    for (const node of nodes) {
        if (
            isCreatedNode(node) &&
            node.CreatedNode.LedgerEntryType === 'AccountRoot'
        ) {
            if (
                node.CreatedNode.NewFields.Balance &&
                node.CreatedNode.NewFields.Account === account
            ) {
                balance = node.CreatedNode.NewFields.Balance as string;
            }
        }

        if (
            isModifiedNode(node) &&
            node.ModifiedNode.LedgerEntryType === 'AccountRoot'
        ) {
            if (
                node.ModifiedNode.FinalFields?.Balance &&
                node.ModifiedNode.FinalFields?.Account === account
            ) {
                balance = node.ModifiedNode.FinalFields.Balance as string;
            }
        }
    }

    return balance;
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

        if (tx.transaction.TransactionType === 'NFTokenMint') {
            if (tx.transaction.Account === this._address) {
                console.log(this._address, ' minted a token: ', tx);
                if (tx.meta) {
                    this.emit(WalletEvent.TokenMint, getNFTokenID(tx.meta));
                }

                const balance = getBalance(
                    this._address,
                    tx.meta?.AffectedNodes ?? []
                );

                if (balance) {
                    this.emit(
                        WalletEvent.BalanceChange,
                        balance,
                        dropsToXrp(balance)
                    );
                }
            }
        }

        if (tx.transaction.TransactionType === 'NFTokenBurn') {
            if (tx.transaction.Account === this._address) {
                console.log(this._address, ' burned a token: ', tx);
                this.emit(WalletEvent.TokenBurn, tx.transaction.NFTokenID);

                const balance = getBalance(
                    this._address,
                    tx.meta?.AffectedNodes ?? []
                );

                if (balance) {
                    this.emit(
                        WalletEvent.BalanceChange,
                        balance,
                        dropsToXrp(balance)
                    );
                }
            }
        }

        if (tx.transaction.TransactionType === 'Payment') {
            if (tx.transaction.Destination === this._address) {
                console.log(this._address, ' received payment: ', tx);

                const balance = getBalance(
                    this._address,
                    tx.meta?.AffectedNodes ?? []
                );

                if (balance) {
                    this.emit(
                        WalletEvent.BalanceChange,
                        balance,
                        dropsToXrp(balance)
                    );
                }

                if (isIssuedCurrency(tx.transaction.Amount)) {
                    this.emit(WalletEvent.CurrencyChange);
                }
            }

            if (tx.transaction.Account === this._address) {
                console.log(this._address, ' sent payment: ', tx);

                const balance = getBalance(
                    this._address,
                    tx.meta?.AffectedNodes ?? []
                );

                if (balance) {
                    this.emit(
                        WalletEvent.BalanceChange,
                        balance,
                        dropsToXrp(balance)
                    );
                }

                if (isIssuedCurrency(tx.transaction.Amount)) {
                    this.emit(WalletEvent.CurrencyChange);
                }
            }
        }

        console.groupEnd();
    };
}

export function createWalletEventEmitter(client: xrplClient, address: string) {
    const walletEmitter = new WalletEmitter(address, client);

    return walletEmitter;
}
