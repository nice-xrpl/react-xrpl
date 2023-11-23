import { useContext, useState } from 'react';
import { BuyOffersStoreManagerProvider } from './store-manager-provider';
import { BuyOffersStoreManagerContext } from './store-manager-context';
import { StoreManager } from '../store-manager';
import { OfferStore } from 'react-xrpl/api';
import { useStoreManager } from '../use-store-manager';

type BuyOffersStoreProps = {
    children: React.ReactNode;
};

export function BuyOffersStore({ children }: BuyOffersStoreProps) {
    const [manager] = useState<StoreManager<OfferStore>>(() => {
        return new StoreManager<OfferStore>({});
    });

    return (
        <BuyOffersStoreManagerProvider store={manager}>
            {children}
        </BuyOffersStoreManagerProvider>
    );
}

export function useBuyOffersStore(address: string) {
    const manager = useContext(BuyOffersStoreManagerContext);

    return useStoreManager(manager, address);
}
