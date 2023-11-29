import { createContext } from 'react';
import { Wallet as xrplWallet } from 'xrpl';

export const WalletContext = createContext<xrplWallet>(null!);
