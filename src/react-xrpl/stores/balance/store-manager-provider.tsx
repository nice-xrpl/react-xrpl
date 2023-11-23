import { StoreManager } from '../store-manager';
import { BalanceStoreManagerContext } from './store-manager-context';

type BalanceStoreProviderProps = {
    store: StoreManager<number>;
    children: React.ReactNode;
};

export function BalanceStoreManagerProvider({
    store,
    children,
}: BalanceStoreProviderProps) {
    return (
        <BalanceStoreManagerContext.Provider value={store}>
            {children}
        </BalanceStoreManagerContext.Provider>
    );
}
