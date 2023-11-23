import { useContext, useState } from 'react';
import { TokensStoreManagerProvider } from './store-manager-provider';
import { TokensStoreManagerContext } from './store-manager-context';
import { StoreManager } from '../store-manager';
import { useStoreManager } from '../use-store-manager';
import { Token } from 'react-xrpl/api';

type TokensStoreProps = {
    children: React.ReactNode;
};

export function TokensStore({ children }: TokensStoreProps) {
    const [manager] = useState<StoreManager<Token[]>>(() => {
        return new StoreManager<Token[]>([]);
    });

    return (
        <TokensStoreManagerProvider store={manager}>
            {children}
        </TokensStoreManagerProvider>
    );
}

export function useTokensStore(address: string) {
    const manager = useContext(TokensStoreManagerContext);

    return useStoreManager(manager, address);
}
