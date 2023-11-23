import { createContext } from 'react';
import { StoreManager } from '../store-manager';
import { Currency } from 'react-xrpl/api';

export const CurrenciesStoreManagerContext = createContext<
    StoreManager<Currency[]>
>(null!);
