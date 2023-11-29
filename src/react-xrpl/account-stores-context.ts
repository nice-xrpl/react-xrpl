import { createContext } from 'react';
import { WalletStore } from './stores/wallet-store-manager';

export const AccountStoresContext = createContext<WalletStore>(null!);
