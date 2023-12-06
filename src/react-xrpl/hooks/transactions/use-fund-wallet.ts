import { useCallback, useRef } from 'react';
import { useWallet, useXRPLClient } from '..';
import { Wallet } from 'xrpl';
import { getInitialWalletState } from 'react-xrpl/api';
import { useWalletStoreManager } from 'src/react-xrpl/stores/use-wallet-store-manager';

export function useFundWallet() {
    const client = useXRPLClient();
    const wallet = useWallet();
    const clientRef = useRef(client);
    clientRef.current = client;

    const walletStoreManager = useWalletStoreManager();

    const fund = useCallback(
        async (
            amount: string
        ): Promise<{
            wallet: Wallet;
            balance: number;
        }> => {
            const result = await clientRef.current.fundWallet(wallet, {
                amount,
            });

            const stores = walletStoreManager.getStoresForAddress(
                wallet.address
            );

            getInitialWalletState(clientRef.current, wallet.address)
                .then((state) => {
                    console.log(wallet.address, state);

                    stores.balance.setState(state.balance);
                    stores.currencies.setState(state.currencies);
                    stores.tokens.setState(state.tokens);
                    stores.buyOffers.setState(state.buyOffers);
                    stores.sellOffers.setState(state.sellOffers);
                    stores.transactionLog.setState(state.transactions);

                    stores.release();
                })
                .catch((error) => {
                    console.log(error);
                    stores.release();
                });

            return result;
        },
        []
    );

    return fund;
}
