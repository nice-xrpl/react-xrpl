import { NetworkEmitter } from '../api/network-emitter';
import { Store, createStore } from './create-store';

export class StoreManager<T> {
    private stores: Map<string, Store<T>> = new Map();
    private refCount: Map<string, number> = new Map();
    private initialValue: T;

    constructor(initialValue: T) {
        this.initialValue = initialValue;
    }

    getStore(address: string): [Store<T>, boolean] {
        let store = this.stores.get(address);
        let refCount = this.refCount.get(address);

        if (store && refCount) {
            this.refCount.set(address, refCount + 1);
            return [store, false];
        }

        store = createStore(this.initialValue);
        this.stores.set(address, store);
        this.refCount.set(address, 1);

        return [store, true];
    }

    releaseStore(address: string): boolean {
        let refCount = this.refCount.get(address);

        if (refCount) {
            refCount--;

            if (refCount === 0) {
                this.stores.delete(address);
                this.refCount.delete(address);

                return true;
            }

            this.refCount.set(address, refCount);

            return false;
        }

        return false;
    }
}
