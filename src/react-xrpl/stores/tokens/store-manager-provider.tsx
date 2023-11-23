import { Token } from 'react-xrpl/api';
import { StoreManager } from '../store-manager';
import { TokensStoreManagerContext } from './store-manager-context';

type TokensStoreProviderProps = {
    store: StoreManager<Token[]>;
    children: React.ReactNode;
};

export function TokensStoreManagerProvider({
    store,
    children,
}: TokensStoreProviderProps) {
    return (
        <TokensStoreManagerContext.Provider value={store}>
            {children}
        </TokensStoreManagerContext.Provider>
    );
}
