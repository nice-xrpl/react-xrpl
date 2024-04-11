import { useEffect } from 'react';
import { useStore } from '../../stores/use-store';
import { useAddress } from './use-address';
import { useWalletStoreManager } from '../../stores/use-wallet-store-manager';
import { suspend } from 'suspend-react';

export function useBuyOffers(tokenId: string, address?: string) {
    // get the current address from account context
    const internalAddress = useAddress(address);
    const { buyOffers } = useWalletStoreManager();

    // get the balance store for the address
    const [store, created] = buyOffers.getStore(internalAddress);

    suspend(async () => {
        if (created) {
            const value = await buyOffers.setInitialBuyOffers(
                internalAddress,
                tokenId
            );

            return value;
        }

        return store.getState();
    });

    // set up network event if needed
    useEffect(() => {
        const firstRef = buyOffers.markStore(internalAddress);

        if (firstRef) {
            buyOffers.enableEvents(internalAddress);
        }

        return () => {
            const released = buyOffers.releaseStore(internalAddress);

            if (released) {
                buyOffers.disableEvents(internalAddress);
            }
        };
    }, [internalAddress, buyOffers, created]);

    // return the store
    return useStore(store);
}
