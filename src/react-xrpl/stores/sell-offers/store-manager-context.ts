import { createContext } from 'react';
import { StoreManager } from '../store-manager';
import { OfferStore } from 'react-xrpl/api';

export const SellOffersStoreManagerContext = createContext<
    StoreManager<OfferStore>
>(null!);
