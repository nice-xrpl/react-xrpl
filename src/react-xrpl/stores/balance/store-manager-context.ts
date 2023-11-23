import { createContext } from 'react';
import { StoreManager } from '../store-manager';

export const BalanceStoreManagerContext = createContext<StoreManager<number>>(
    null!
);
