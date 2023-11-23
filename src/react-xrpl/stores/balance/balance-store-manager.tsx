import { useContext, useState } from 'react';
import { BalanceStoreManagerProvider } from './store-manager-provider';
import { BalanceStoreManagerContext } from './store-manager-context';
import { StoreManager } from '../store-manager';
import { useStoreManager } from '../use-store-manager';

type BalanceStoreProps = {
    children: React.ReactNode;
};

export function BalanceStore({ children }: BalanceStoreProps) {
    const [manager] = useState<StoreManager<number>>(() => {
        return new StoreManager<number>(0);
    });

    return (
        <BalanceStoreManagerProvider store={manager}>
            {children}
        </BalanceStoreManagerProvider>
    );
}

export function useBalanceStore(address: string) {
    const manager = useContext(BalanceStoreManagerContext);

    return useStoreManager(manager, address);
}
