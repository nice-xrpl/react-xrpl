import { createContext, useState } from 'react';
import { StoreManager } from './store-manager';
import {
    Currency,
    OfferStore,
    Token,
    TransactionLogEntry,
} from '../api/wallet-types';
import { WalletStoreManagerContext } from './wallet-store-manager-context';

type WalletStoreManagerProps = {
    children: React.ReactNode;
};

type WalletStoreManager = {
    balance: StoreManager<number>;
    buyOffers: StoreManager<OfferStore>;
    sellOffers: StoreManager<OfferStore>;
    currencies: StoreManager<Currency[]>;
    tokens: StoreManager<Token[]>;
    transactionLog: StoreManager<TransactionLogEntry[]>;
};

export function WalletStoreManager({ children }: WalletStoreManagerProps) {
    const [managers] = useState<WalletStoreManager>(() => {
        return {
            balance: new StoreManager(0),
            buyOffers: new StoreManager<OfferStore>({}),
            sellOffers: new StoreManager<OfferStore>({}),
            currencies: new StoreManager<Currency[]>([]),
            tokens: new StoreManager<Token[]>([]),
            transactionLog: new StoreManager<TransactionLogEntry[]>([]),
        };
    });

    return (
        <WalletStoreManagerContext.Provider
            value={managers}
        ></WalletStoreManagerContext.Provider>
    );
}
