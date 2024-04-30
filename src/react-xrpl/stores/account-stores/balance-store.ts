import { getBalances } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Client as xrplClient } from 'xrpl';

/**
 * Manages balance stores for addresses.
 *
 * Handles setting initial balances, enabling and disabling events for addresses.
 */
export class BalanceStoreManager extends StoreManager<string> {
    private networkEmitter: NetworkEmitter;
    private onBalanceChange: ((drops: string, xrp: number) => void) | null;
    private client: xrplClient;
    private events = false;

    /**
     * @param client The xrplClient to use for requests.
     * @param networkEmitter The network emitter to use for events.
     */
    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super('');

        this.networkEmitter = networkEmitter;
        this.onBalanceChange = null;
        this.client = client;
    }

    /**
     * Sets the initial balance for a given address.
     *
     * @param address The address for which to set the initial balance.
     * @return A promise that resolves to the balance of the address.
     */
    public async setInitialBalance(address: string): Promise<string> {
        const [store] = this.getStore(address);
        const [balance] = await getBalances(this.client, address);
        store.setState(balance);

        return balance;
    }

    /**
     * Enables events for a specific address by adding a balance listener and setting up the necessary event handling.
     *
     * @param address The address for which to enable events.
     */
    public enableEvents(address: string) {
        if (this.events) {
            return;
        }

        const [store] = this.getStore(address);

        console.log('added balance listener for ', address);
        this.onBalanceChange = (drops: string, xrp: number) => {
            store.setState(`${xrp}`);
        };

        this.networkEmitter.on(
            address,
            WalletEvents.BalanceChange,
            this.onBalanceChange
        );

        this.events = true;
    }

    /**
     * Disables events for a specific address by removing the balance listener and necessary event handling.
     *
     * @param address The address for which to disable events.
     */
    public disableEvents(address: string) {
        if (!this.events) {
            return;
        }

        if (this.onBalanceChange === null) {
            return;
        }

        console.log('removed balance listener for ', address);
        this.networkEmitter.off(
            address,
            WalletEvents.BalanceChange,
            this.onBalanceChange
        );

        this.events = false;
    }
}
