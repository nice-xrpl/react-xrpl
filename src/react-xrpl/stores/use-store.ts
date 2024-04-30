import { useSyncExternalStore } from 'react';
import { Store } from './create-store';

/**
 * Returns the current state of the store by subscribing to changes and getting the current state.
 *
 * @param {Store<T>} store - The store object to subscribe to and get the current state from.
 * @return {T} The current state of the store.
 */
export function useStore<T>(store: Store<T>) {
    return useSyncExternalStore(store.subscribe, store.getState);
}
