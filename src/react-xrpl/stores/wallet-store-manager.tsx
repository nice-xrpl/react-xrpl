import { useMemo } from 'react';
import { WalletStoreManagerContext } from './wallet-store-manager-context';
import { useNetworkEmitter } from '../hooks/use-network-emitter';
import { BalanceStoreManager } from './account-stores/balance-store';
import { useXRPLClient } from '../hooks/use-xrpl-client';
import { BuyOfferStoreManager } from './account-stores/buy-offer-store';
import { SellOfferStoreManager } from './account-stores/sell-offer-store';
import { TokenStoreManager } from './account-stores/token-store';
import { CurrencyStoreManager } from './account-stores/currency-store';

type WalletStoreManagerProps = {
    children: React.ReactNode;
};

/**
 * A React component that provides a context for managing wallet stores.
 *
 * @param {WalletStoreManagerProps} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @return {JSX.Element} The JSX element representing the provider.
 */
export function WalletStoreManagerProvider({
    children,
}: WalletStoreManagerProps) {
    const networkEmitter = useNetworkEmitter();
    const client = useXRPLClient();

    const stores = useMemo(() => {
        return {
            balance: new BalanceStoreManager(client, networkEmitter),
            buyOffers: new BuyOfferStoreManager(client, networkEmitter),
            sellOffers: new SellOfferStoreManager(client, networkEmitter),
            currencies: new CurrencyStoreManager(client, networkEmitter),
            tokens: new TokenStoreManager(client, networkEmitter),
        };
    }, [client, networkEmitter]);

    return (
        <WalletStoreManagerContext.Provider value={stores}>
            {children}
        </WalletStoreManagerContext.Provider>
    );
}
