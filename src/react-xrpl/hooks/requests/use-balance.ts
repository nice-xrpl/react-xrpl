import { useEffect } from 'react';
import { useStore } from '../../stores/use-store';
import { useAddress } from './use-address';
import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { useStoreManager } from '../../stores/use-store-manager';
import { suspend } from 'suspend-react';

export function useBalance(address?: string) {
    const { balance } = useWalletStoreManager();

    const onCreated = (internalAddress: string) => {
        return balance.setInitialBalance(internalAddress);
    };

    return useStoreManager(balance, onCreated, address);
}
