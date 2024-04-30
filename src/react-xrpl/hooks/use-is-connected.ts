import { useStore } from '../stores/use-store';
import { useClientStores } from './';

/**
 * Returns the current connection status.
 *
 * @return {boolean} The connection status.
 */
export function useIsConnected() {
    const { connected: connectedStore } = useClientStores();

    return useStore(connectedStore);
}
