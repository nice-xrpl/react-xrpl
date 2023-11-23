import { useContext, useState } from 'react';
import { TransactionLogStoreManagerProvider } from './store-manager-provider';
import { TransactionLogStoreManagerContext } from './store-manager-context';
import { StoreManager } from '../store-manager';
import { useStoreManager } from '../use-store-manager';

type TransactionLogStoreProps = {
    children: React.ReactNode;
};

export function TransactionLogStore({ children }: TransactionLogStoreProps) {
    const [manager] = useState<StoreManager<number>>(() => {
        return new StoreManager<number>(0);
    });

    return (
        <TransactionLogStoreManagerProvider store={manager}>
            {children}
        </TransactionLogStoreManagerProvider>
    );
}

export function useTransactionLogStore(address: string) {
    const manager = useContext(TransactionLogStoreManagerContext);

    return useStoreManager(manager, address);
}
