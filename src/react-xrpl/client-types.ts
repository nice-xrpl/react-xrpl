import { Store } from './stores/create-store';

export type ClientStores = {
    connected: Store<boolean>;
};
