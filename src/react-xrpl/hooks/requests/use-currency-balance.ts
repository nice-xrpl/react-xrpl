import { useStore } from "../../stores/use-store";
import { useWalletStores } from "../use-wallet-stores";

export function useCurrencyBalance() {
	const { currencies: currenciesStore } = useWalletStores();

	return useStore(currenciesStore);
}