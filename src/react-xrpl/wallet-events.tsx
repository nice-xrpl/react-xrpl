import { useEffect } from "react";
import { createWalletEventEmitter, Currency, WalletEvent } from "./api";
import { getBalances, getTokens } from "./api/requests";
import { useWalletAddress, useWalletStores, useXRPLClient } from "./hooks";

export function WalletEvents() {
	const client = useXRPLClient();
	const address = useWalletAddress();

	const { balance: balanceStore, currencies: currenciesStore, tokens: tokensStore } = useWalletStores();

	useEffect(() => {
		const events = createWalletEventEmitter(client, address);

		const currenciesListener = () => {
			getBalances(client, address).then((balances) => {
				let currencies: Currency[] = [];

				for (const balance of balances) {
					if (balance.issuer) {
						currencies.push({
							currency: balance.currency,
							issuer: balance.issuer,
							value: parseFloat(balance.value) ?? 0
						});
					}
				}

				currenciesStore.setState(currencies);
			});
		};

		events.on(WalletEvent.CurrencyChange, currenciesListener);

		const tokensListener = () => {
			getTokens(client, address).then((tokens) => {
				tokensStore.setState(tokens);
			});
		};

		events.on(WalletEvent.TokenMint, tokensListener);
		events.on(WalletEvent.TokenBurn, tokensListener);

		const balanceChangeListener = (drops: string, xrp: number) => {
			console.log(WalletEvent.BalanceChange, drops, xrp);
			balanceStore.setState(xrp);
		};

		events.on(WalletEvent.BalanceChange, balanceChangeListener);

		events.start();

		return () => {
			events.off(WalletEvent.CurrencyChange, currenciesListener);

			events.off(WalletEvent.TokenMint, tokensListener);
			events.off(WalletEvent.TokenBurn, tokensListener);

			events.off(WalletEvent.BalanceChange, balanceChangeListener);

			events.stop();
		};
	}, [client, address]);
	
	return null;
}