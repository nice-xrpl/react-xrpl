import { createContext } from 'react';
import { StoreManager } from '../store-manager';
import { Token } from 'react-xrpl/api';

export const TokensStoreManagerContext = createContext<StoreManager<Token[]>>(
    null!
);
