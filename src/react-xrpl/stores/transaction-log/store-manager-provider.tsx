import { StoreManager } from '../store-manager';
import { TransactionLogStoreManagerContext } from './store-manager-context';

type TransactionLogStoreProviderProps = {
    store: StoreManager<number>;
    children: React.ReactNode;
};

export function TransactionLogStoreManagerProvider({
    store,
    children,
}: TransactionLogStoreProviderProps) {
    return (
        <TransactionLogStoreManagerContext.Provider value={store}>
            {children}
        </TransactionLogStoreManagerContext.Provider>
    );
}
