import { createContext, useState } from 'react';
import { StoreManager } from './store-manager';
import {
    Currency,
    OfferStore,
    Token,
    TransactionLogEntry,
} from '../api/wallet-types';
import { WalletStoreManagerContext } from './wallet-store-manager-context';
import { Store } from './create-store';

type WalletStoreManagerProps = {
    children: React.ReactNode;
};

export class WalletStore {
    balance: Store<string>;
    buyOffers: Store<OfferStore>;
    sellOffers: Store<OfferStore>;
    currencies: Store<Currency[]>;
    tokens: Store<Token[]>;
    transactionLog: Store<TransactionLogEntry[]>;

    storeManager: WalletStoreManager;
    address: string;

    constructor(storeManager: WalletStoreManager, address: string) {
        this.balance = storeManager.balance.getStore(address);
        this.buyOffers = storeManager.buyOffers.getStore(address);
        this.currencies = storeManager.currencies.getStore(address);
        this.sellOffers = storeManager.sellOffers.getStore(address);
        this.tokens = storeManager.tokens.getStore(address);
        this.transactionLog = storeManager.transactionLog.getStore(address);

        this.storeManager = storeManager;
        this.address = address;
    }

    release() {
        this.storeManager.balance.releaseStore(this.address);
        this.storeManager.buyOffers.releaseStore(this.address);
        this.storeManager.currencies.releaseStore(this.address);
        this.storeManager.sellOffers.releaseStore(this.address);
        this.storeManager.tokens.releaseStore(this.address);
        this.storeManager.transactionLog.releaseStore(this.address);
    }
}

export class WalletStoreManager {
    balance: StoreManager<string>;
    buyOffers: StoreManager<OfferStore>;
    sellOffers: StoreManager<OfferStore>;
    currencies: StoreManager<Currency[]>;
    tokens: StoreManager<Token[]>;
    transactionLog: StoreManager<TransactionLogEntry[]>;

    constructor() {
        this.balance = new StoreManager('');
        this.buyOffers = new StoreManager<OfferStore>({});
        this.sellOffers = new StoreManager<OfferStore>({});
        this.currencies = new StoreManager<Currency[]>([]);
        this.tokens = new StoreManager<Token[]>([]);
        this.transactionLog = new StoreManager<TransactionLogEntry[]>([]);
    }

    getStoresForAddress(address: string): WalletStore {
        return new WalletStore(this, address);
    }
}
export function WalletStoreManagerProvider({
    children,
}: WalletStoreManagerProps) {
    const [manager] = useState<WalletStoreManager>(() => {
        return new WalletStoreManager();
    });

    return (
        <WalletStoreManagerContext.Provider value={manager}>
            {children}
        </WalletStoreManagerContext.Provider>
    );
}
