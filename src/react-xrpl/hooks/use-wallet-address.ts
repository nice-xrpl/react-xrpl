import { useContext } from 'react';
import { WalletAddressContext } from '../wallet-address-provider';

export function useWalletAddress() {
    const address = useContext(WalletAddressContext);

    if (!address) {
        throw new Error('Wallet address context not found!');
    }

    return address;
}
