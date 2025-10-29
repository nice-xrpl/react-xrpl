import { getBalances } from '../api/requests';
import { Client as xrplClient } from 'xrpl';
import { createStore, Store } from '../stores/create-store';
import { Currency } from 'react-xrpl/api';

export class CurrencyStore {
    private _store: Store<Currency[]>;
    private _client: xrplClient;
    private _address: string;

    constructor(client: xrplClient, address: string) {
        this._store = createStore<Currency[]>([]);
        this._client = client;
        this._address = address;

        this.onCurrencyChange = this.onCurrencyChange.bind(this);
    }

    public getStore() {
        return this._store;
    }

    public async setInitialBalance() {
        const [, currencies] = await getBalances(this._client, this._address);
        this._store.setState(currencies);

        return currencies;
    }

    public onCurrencyChange() {
        getBalances(this._client, this._address).then(([, currencies]) => {
            this._store.setState(currencies);
        });
    }
}
