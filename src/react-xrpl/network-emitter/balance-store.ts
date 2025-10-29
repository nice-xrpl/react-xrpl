import { getBalances } from '../api/requests';
import { Client as xrplClient } from 'xrpl';
import { createStore, Store } from '../stores/create-store';

export class BalanceStore {
    private _store: Store<string>;
    private _client: xrplClient;
    private _address: string;

    constructor(client: xrplClient, address: string) {
        this._store = createStore<string>('0');
        this._client = client;
        this._address = address;
    }

    public getStore() {
        return this._store;
    }

    public async setInitialBalance() {
        const [balance] = await getBalances(this._client, this._address);
        this._store.setState(balance);

        return balance;
    }

    public onBalanceChange(drops: string, xrp: number) {
        this._store.setState(`${xrp}`);
    }
}
