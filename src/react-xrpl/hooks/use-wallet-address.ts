import { useContext } from 'react';
import { WalletAddressContext } from '../wallet-address-context';

/**
 * A hook that returns the wallet address.
 *
 * @return {string} The wallet address.
 */
export function useWalletAddress() {
    const address = useContext(WalletAddressContext);

    // if (!address) {
    //     throw new Error('Wallet address context not found!');
    // }

    return address;
}
