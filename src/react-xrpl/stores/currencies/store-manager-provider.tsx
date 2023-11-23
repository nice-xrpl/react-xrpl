import { Currency } from 'react-xrpl/api';
import { StoreManager } from '../store-manager';
import { CurrenciesStoreManagerContext } from './store-manager-context';

type CurrenciesStoreProviderProps = {
    store: StoreManager<Currency[]>;
    children: React.ReactNode;
};

export function CurrenciesStoreManagerProvider({
    store,
    children,
}: CurrenciesStoreProviderProps) {
    return (
        <CurrenciesStoreManagerContext.Provider value={store}>
            {children}
        </CurrenciesStoreManagerContext.Provider>
    );
}
