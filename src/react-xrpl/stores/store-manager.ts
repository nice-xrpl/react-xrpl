import { Store, createStore } from './create-store';

export class StoreManager<T> {
    private stores: Map<string, Store<T>> = new Map();
    private refCount: Map<string, number> = new Map();
    private initialValue: T;

    constructor(initialValue: T) {
        this.initialValue = initialValue;
    }

    getStore(address: string) {
        let store = this.stores.get(address);
        let refCount = this.refCount.get(address);

        if (store && refCount) {
            this.refCount.set(address, refCount + 1);
            return store;
        }

        store = createStore(this.initialValue);
        this.stores.set(address, store);
        this.refCount.set(address, 1);

        return store;
    }

    releaseStore(address: string) {
        let refCount = this.refCount.get(address);

        if (refCount) {
            refCount--;

            if (refCount === 0) {
                this.stores.delete(address);
                this.refCount.delete(address);

                return;
            }

            this.refCount.set(address, refCount);

            return;
        }

        return;
    }
}
