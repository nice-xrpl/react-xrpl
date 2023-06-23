import { useStore } from '../stores/use-store';
import { useClientStores } from './';

export function useIsConnected() {
    const { connected: connectedStore } = useClientStores();

    return useStore(connectedStore);
}
