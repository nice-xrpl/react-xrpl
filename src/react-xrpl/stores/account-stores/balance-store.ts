import { getBalances } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Client as xrplClient } from 'xrpl';

export class BalanceStoreManager extends StoreManager<string> {
    private networkEmitter: NetworkEmitter;
    private onBalanceChange: ((drops: string, xrp: number) => void) | null;
    private client: xrplClient;
    private events = false;

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super('');

        this.networkEmitter = networkEmitter;
        this.onBalanceChange = null;
        this.client = client;
    }

    public async setInitialBalance(address: string): Promise<string> {
        const [store] = this.getStore(address);
        const [balance] = await getBalances(this.client, address);
        store.setState(balance);

        return balance;
    }

    public enableEvents(address: string) {
        if (this.events) {
            return;
        }

        const [store] = this.getStore(address);

        console.log('added listener for ', address);
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

    public disableEvents(address: string) {
        if (!this.events) {
            return;
        }

        if (this.onBalanceChange === null) {
            return;
        }

        console.log('removed listener for ', address);
        this.networkEmitter.off(
            address,
            WalletEvents.BalanceChange,
            this.onBalanceChange
        );

        this.events = false;
    }
}
