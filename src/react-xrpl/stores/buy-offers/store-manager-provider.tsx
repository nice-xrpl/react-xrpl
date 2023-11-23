import { OfferStore } from 'react-xrpl/api';
import { StoreManager } from '../store-manager';
import { BuyOffersStoreManagerContext } from './store-manager-context';

type BuyOffersStoreProviderProps = {
    store: StoreManager<OfferStore>;
    children: React.ReactNode;
};

export function BuyOffersStoreManagerProvider({
    store,
    children,
}: BuyOffersStoreProviderProps) {
    return (
        <BuyOffersStoreManagerContext.Provider value={store}>
            {children}
        </BuyOffersStoreManagerContext.Provider>
    );
}
