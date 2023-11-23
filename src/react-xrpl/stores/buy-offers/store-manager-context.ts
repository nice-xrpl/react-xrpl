import { createContext } from 'react';
import { StoreManager } from '../store-manager';
import { OfferStore } from 'react-xrpl/api';

export const BuyOffersStoreManagerContext = createContext<
    StoreManager<OfferStore>
>(null!);
