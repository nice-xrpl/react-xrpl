import { useMemo } from 'react';
import { StoreManager } from './store-manager';
import { Currency, OfferStore, Token } from '../api/wallet-types';
import { WalletStoreManagerContext } from './wallet-store-manager-context';
import { useNetworkEmitter } from '../hooks/use-network-emitter';
import { BalanceStoreManager } from './account-stores/balance-store';
import { useXRPLClient } from '../hooks/use-xrpl-client';

type WalletStoreManagerProps = {
    children: React.ReactNode;
};

export function WalletStoreManagerProvider({
    children,
}: WalletStoreManagerProps) {
    const networkEmitter = useNetworkEmitter();
    const client = useXRPLClient();

    const stores = useMemo(() => {
        return {
            balance: new BalanceStoreManager(client, networkEmitter),
            buyOffers: new StoreManager<OfferStore>({}),
            sellOffers: new StoreManager<OfferStore>({}),
            currencies: new StoreManager<Currency[]>([]),
            tokens: new StoreManager<Token[]>([]),
        };
    }, [networkEmitter]);

    return (
        <WalletStoreManagerContext.Provider value={stores}>
            {children}
        </WalletStoreManagerContext.Provider>
    );
}
