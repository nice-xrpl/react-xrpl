import { getBalances } from 'react-xrpl/api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { Store } from '../create-store';
import { StoreManager } from '../store-manager';
import { Client as xrplClient } from 'xrpl';

export class BalanceStoreManager {
    private store: StoreManager<string>;
    private networkEmitter: NetworkEmitter;
    private onBalanceChange: ((drops: string, xrp: number) => void) | null;
    private client: xrplClient;

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        this.store = new StoreManager<string>('');
        this.networkEmitter = networkEmitter;
        this.onBalanceChange = null;
        this.client = client;
    }

    public async getStore(
        address: string
    ): Promise<[Store<string>, () => void]> {
        console.log('getting store for ', address);
        const [balanceStore, created] = this.store.getStore(address);

        if (created) {
            console.log('added listener for ', address);
            this.onBalanceChange = (drops: string, xrp: number) => {
                balanceStore.setState(`${xrp}`);
            };

            this.networkEmitter.on(
                address,
                WalletEvents.BalanceChange,
                this.onBalanceChange
            );

            const [initialBalance] = await getBalances(this.client, address);
            console.log('retrieved balance');

            balanceStore.setState(initialBalance);
        }

        return Promise.resolve([
            balanceStore,
            () => {
                const released = this.store.releaseStore(address);
                console.log('released store for ', address);

                if (released && this.onBalanceChange) {
                    console.log('removed listener for ', address);
                    this.networkEmitter.off(
                        address,
                        WalletEvents.BalanceChange,
                        this.onBalanceChange
                    );
                }
            },
        ]);
    }
}
