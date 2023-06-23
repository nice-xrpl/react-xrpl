import { useSyncExternalStore } from 'react';
import { Store } from './create-store';

export function useStore<T>(store: Store<T>) {
    return useSyncExternalStore(store.subscribe, store.getState);
}
