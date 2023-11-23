import { OfferStore } from 'react-xrpl/api';
import { StoreManager } from '../store-manager';
import { SellOffersStoreManagerContext } from './store-manager-context';

type SellOffersStoreProviderProps = {
    store: StoreManager<OfferStore>;
    children: React.ReactNode;
};

export function SellOffersStoreManagerProvider({
    store,
    children,
}: SellOffersStoreProviderProps) {
    return (
        <SellOffersStoreManagerContext.Provider value={store}>
            {children}
        </SellOffersStoreManagerContext.Provider>
    );
}
