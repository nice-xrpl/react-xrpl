import { useStore } from "../../stores/use-store";
import { useWalletStores } from "../use-wallet-stores";

export function useBalance() {
	const { balance: balanceStore } = useWalletStores();

	return useStore(balanceStore);
}