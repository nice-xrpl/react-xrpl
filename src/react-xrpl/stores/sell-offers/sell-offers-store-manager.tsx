import { useContext, useState } from 'react';
import { SellOffersStoreManagerProvider } from './store-manager-provider';
import { SellOffersStoreManagerContext } from './store-manager-context';
import { StoreManager } from '../store-manager';
import { OfferStore } from 'react-xrpl/api';
import { useStoreManager } from '../use-store-manager';

type SellOffersStoreProps = {
    children: React.ReactNode;
};

export function SellOffersStore({ children }: SellOffersStoreProps) {
    const [manager] = useState<StoreManager<OfferStore>>(() => {
        return new StoreManager<OfferStore>({});
    });

    return (
        <SellOffersStoreManagerProvider store={manager}>
            {children}
        </SellOffersStoreManagerProvider>
    );
}

export function useSellOffersStore(address: string) {
    const manager = useContext(SellOffersStoreManagerContext);

    return useStoreManager(manager, address);
}
