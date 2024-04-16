import { Client as xrplClient } from 'xrpl';
import { createContext } from 'react';

export const XRPLClientContext = createContext<xrplClient | null>(null);
