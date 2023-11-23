import { createContext } from 'react';
import { StoreManager } from '../store-manager';

export const TransactionLogStoreManagerContext = createContext<
    StoreManager<number>
>(null!);
