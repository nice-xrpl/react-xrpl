import React, { useEffect, useState } from "react";
import { Wallet as xrplWallet } from 'xrpl';
import { WalletProvider, WalletStores } from "./wallet-provider";
import { createWalletFromSeed } from "./api";
import { Currency, Token } from "./api/wallet-types";
import { createStore } from "./stores/create-store";
import { WalletAddress } from "./wallet-address";
import { useXRPLClient } from "./hooks";

type WalletProps = {
	seed: string;
	fallback?: React.ReactElement;
	children?: React.ReactNode;
}

export function Wallet({seed, fallback = (<></>), children}: WalletProps) {
	const client = useXRPLClient();
	const [wallet, setWallet] = useState<xrplWallet>();

	const [walletStore] = useState<WalletStores>(() => {
		return {
			balance: createStore<number>(0),
			tokens: createStore<Token[]>([]),
			currencies: createStore<Currency[]>([]),
		}
	})

	useEffect(() => {
		createWalletFromSeed(client, seed).then((created) => {
			// console.log('created wallet...');
			setWallet(created.wallet);

			walletStore.balance.setState(created.balance);
			walletStore.currencies.setState(created.currencies);
			walletStore.tokens.setState(created.tokens);
		});
	}, [seed]);
	
	return (
		wallet ? 
			<WalletProvider wallet={wallet}>
				<WalletAddress address={wallet.address}>
					{children}
				</WalletAddress>
			</WalletProvider> 
		: fallback
	);
}