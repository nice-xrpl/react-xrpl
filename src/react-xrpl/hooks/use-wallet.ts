import { useContext } from "react";
import { WalletContext } from "../wallet-provider";
import { Wallet as xrplWallet } from 'xrpl';

export function useWallet(): xrplWallet {
	const wallet = useContext(WalletContext);
	
	if (!wallet) {
		throw new Error('Wallet context not found!');
	}

	return wallet;
}