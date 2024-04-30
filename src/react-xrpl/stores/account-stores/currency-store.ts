import { getBalances } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Client as xrplClient } from 'xrpl';
import { Currency } from '../../api/wallet-types';

/**
 * Manages currency stores for addresses.
 */
export class CurrencyStoreManager extends StoreManager<Currency[]> {
    private networkEmitter: NetworkEmitter;
    private onCurrencyChange: (() => void) | null;
    private client: xrplClient;
    private events = false;

    /**
     * Constructs a new CurrencyStoreManager.
     *
     * @param client The XRPL client.
     * @param networkEmitter The network emitter.
     */
    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super([]);

        this.networkEmitter = networkEmitter;
        this.onCurrencyChange = null;
        this.client = client;
    }

    /**
     * Sets the initial balance for a given address.
     *
     * @param address The address for which to set the initial balance.
     * @return A promise that resolves to the balance of the address.
     */
    public async setInitialBalance(address: string): Promise<Currency[]> {
        const [store] = this.getStore(address);
        const [, currencies] = await getBalances(this.client, address);
        store.setState(currencies);

        return currencies;
    }

    /**
     * Enables events for a specific address by adding a currency listener and setting up the necessary event handling.
     *
     * @param address The address for which to enable events.
     */
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

    /**
     * Disables events for a specific address by removing the currency listener and necessary event handling.
     *
     * @param address The address for which to disable events.
     */
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
