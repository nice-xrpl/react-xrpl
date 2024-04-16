import { getBalances } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Client as xrplClient } from 'xrpl';
import { Currency } from '../../api/wallet-types';

export class CurrencyStoreManager extends StoreManager<Currency[]> {
    private networkEmitter: NetworkEmitter;
    private onCurrencyChange: (() => void) | null;
    private client: xrplClient;
    private events = false;

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super([]);

        this.networkEmitter = networkEmitter;
        this.onCurrencyChange = null;
        this.client = client;
    }

    public async setInitialBalance(address: string) {
        const [store] = this.getStore(address);
        const [, currencies] = await getBalances(this.client, address);
        store.setState(currencies);

        return currencies;
    }

    public enableEvents(address: string) {
        if (this.events) {
            return;
        }

        const [store] = this.getStore(address);

        console.log('added currency listener for ', address);
        this.onCurrencyChange = () => {
            getBalances(this.client, address).then(([, currencies]) => {
                if (this.hasStore(address)) {
                    const [store] = this.getStore(address);
                    store.setState(currencies);
                }
            });
        };

        this.networkEmitter.on(
            address,
            WalletEvents.CurrencyChange,
            this.onCurrencyChange
        );

        this.events = true;
    }

    public disableEvents(address: string) {
        if (!this.events) {
            return;
        }

        if (this.onCurrencyChange === null) {
            return;
        }

        console.log('removed currency listener for ', address);
        this.networkEmitter.off(
            address,
            WalletEvents.CurrencyChange,
            this.onCurrencyChange
        );

        this.events = false;
    }
}
