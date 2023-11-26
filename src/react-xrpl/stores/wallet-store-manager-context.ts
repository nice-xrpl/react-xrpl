import { createContext } from 'react';
import { WalletStoreManager } from './wallet-store-manager';

export const WalletStoreManagerContext = createContext<WalletStoreManager>(
    null!
);
