import { useContext, useState } from 'react';
import { CurrenciesStoreManagerProvider } from './store-manager-provider';
import { CurrenciesStoreManagerContext } from './store-manager-context';
import { StoreManager } from '../store-manager';
import { useStoreManager } from '../use-store-manager';
import { Currency } from 'react-xrpl/api';

type CurrenciesStoreProps = {
    children: React.ReactNode;
};

export function CurrenciesStore({ children }: CurrenciesStoreProps) {
    const [manager] = useState<StoreManager<Currency[]>>(() => {
        return new StoreManager<Currency[]>([]);
    });

    return (
        <CurrenciesStoreManagerProvider store={manager}>
            {children}
        </CurrenciesStoreManagerProvider>
    );
}

export function useCurrenciesStore(address: string) {
    const manager = useContext(CurrenciesStoreManagerContext);

    return useStoreManager(manager, address);
}
