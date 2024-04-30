/**
 * Manages a set of stores for a given type.  It ensures that only one store
 * is created per address, and that stores are garbage collected when there
 * are no more references to them.
 */
import { Store, createStore } from './create-store';

export class StoreManager<T> {
    /**
     * The set of stores being managed.
     */
    private stores: Map<string, Store<T>> = new Map();

    /**
     * The set of reference counts for each store in {@link stores}.
     */
    private refCount: Map<string, number> = new Map();

    /**
     * The initial value for each store.
     */
    private initialValue: T;

    /**
     * Creates a new instance of the StoreManager class.
     *
     * @param initialValue The initial value for each store.
     */
    constructor(initialValue: T) {
        this.initialValue = initialValue;
    }

    /**
     * Determines if there is a store associated with the given address.
     *
     * @param address The address to check for a store.
     * @return True if a store exists for the given address, false otherwise.
     */
    public hasStore(address: string): boolean {
        return this.stores.has(address);
    }

    /**
     * Gets the store associated with the given address, and marks it as in use.
     * If no store exists for the given address, one is created.
     *
     * @param address The address to get the store for.
     * @return A tuple containing the store, and a boolean indicating whether
     * a new store was created or not.
     */
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

    /**
     * Marks a store as being in use, and returns a boolean indicating whether
     * this is the first reference to the store or not.
     *
     * @param address The address of the store to mark.
     * @return True if this is the first reference to the store, false otherwise.
     */
    markStore(address: string): boolean {
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

    /**
     * Releases a store, and returns a boolean indicating whether the store
     * was released or not.
     *
     * @param address The address of the store to release.
     * @return True if the store was released, false otherwise.
     */
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
