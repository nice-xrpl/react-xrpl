import { Store, createStore } from './create-store';

export class StoreManager<T> {
    private stores: Map<string, Store<T>> = new Map();
    private refCount: Map<string, number> = new Map();
    private initialValue: T;

    constructor(initialValue: T) {
        this.initialValue = initialValue;
    }

    public hasStore(address: string) {
        return this.stores.has(address);
    }

    public getStore(address: string): [Store<T>, boolean] {
        let store = this.stores.get(address);

        if (store) {
            return [store, false];
        }

        store = createStore(this.initialValue);
        this.stores.set(address, store);
        this.refCount.set(address, 0);

        return [store, true];
    }

    markStore(address: string) {
        let refCount = this.refCount.get(address);
        let firstRef = false;

        console.log('marking store: ', address, refCount);

        if (refCount === 0) {
            // first ref
            firstRef = true;
        }

        if (refCount || refCount === 0) {
            this.refCount.set(address, refCount + 1);
        }

        return firstRef;
    }

    releaseStore(address: string): boolean {
        let refCount = this.refCount.get(address);

        console.log('releasing store: ', address, refCount);

        if (!refCount && refCount !== 0) {
            return false;
        }

        if (refCount === 0) {
            this.stores.delete(address);
            this.refCount.delete(address);

            return true;
        }

        refCount--;

        if (refCount === 0) {
            this.stores.delete(address);
            this.refCount.delete(address);

            return true;
        }

        this.refCount.set(address, refCount);

        return false;
    }
}
