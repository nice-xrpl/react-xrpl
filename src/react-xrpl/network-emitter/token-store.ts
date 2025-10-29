import { getBalances, getTokens } from '../api/requests';
import { Client as xrplClient } from 'xrpl';
import { createStore, Store } from '../stores/create-store';
import { Token } from 'react-xrpl/api';

export class TokenStore {
    private _store: Store<Token[]>;
    private _client: xrplClient;
    private _address: string;

    constructor(client: xrplClient, address: string) {
        this._store = createStore<Token[]>([]);
        this._client = client;
        this._address = address;

        this.onTokenMint = this.onTokenMint.bind(this);
        this.onTokenBurn = this.onTokenBurn.bind(this);
        this.onAcceptBuyOffer = this.onAcceptBuyOffer.bind(this);
        this.onAcceptSellOffer = this.onAcceptSellOffer.bind(this);
    }

    public getStore() {
        return this._store;
    }

    public async setInitialTokens() {
        const tokens = await getTokens(this._client, this._address);
        this._store.setState(tokens);

        return tokens;
    }

    public onTokenMint(token: string, timestamp: number) {
        getTokens(this._client, this._address).then((tokens) => {
            this._store.setState(tokens);
        });
    }

    public onTokenBurn(token: string, timestamp: number) {
        getTokens(this._client, this._address).then((tokens) => {
            this._store.setState(tokens);
        });
    }

    public onAcceptBuyOffer(index: string, tokenId: string) {
        getTokens(this._client, this._address).then((tokens) => {
            this._store.setState(tokens);
        });
    }

    public onAcceptSellOffer(index: string, tokenId: string) {
        getTokens(this._client, this._address).then((tokens) => {
            this._store.setState(tokens);
        });
    }
}
