import { useContext } from 'react';
import { WalletContext } from '../wallet-context';
import { Wallet as xrplWallet } from 'xrpl';

/**
 * A hook that returns the xrplWallet object from the WalletContext.
 *
 * @return {xrplWallet} The xrplWallet object from the WalletContext.
 */
export function useWallet(): xrplWallet {
    const wallet = useContext(WalletContext);

    // if (!wallet) {
    //     throw new Error('Wallet context not found!');
    // }

    return wallet;
}
