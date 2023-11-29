import { useEffect } from 'react';
import { useWalletAddress, useXRPLClient } from './hooks';
import { Currency } from './api';
import { useNetworkEmitter } from './hooks/use-network-emitter';
import { useWalletStoreManager } from './stores/use-wallet-store-manager';
import {
    getBalances,
    getBuyOffers,
    getSellOffers,
    getTokens,
} from './api/requests';
import { WalletEvent } from './api/network-emitter';
import { Amount } from 'xrpl';
import { useAccountStore } from './hooks/use-account-store';

export function AccountEvents() {
    const client = useXRPLClient();
    const address = useWalletAddress();

    // enable account events
    // update store

    const networkEmitter = useNetworkEmitter();
    const stores = useAccountStore();

    useEffect(() => {
        networkEmitter.addAddress(address);

        const events = networkEmitter.getEmitter(address);

        const currenciesListener = () => {
            getBalances(client, address).then((balances) => {
                let currencies: Currency[] = [];

                for (const balance of balances) {
                    if (balance.issuer) {
                        currencies.push({
                            currency: balance.currency,
                            issuer: balance.issuer,
                            value: parseFloat(balance.value) ?? 0,
                        });
                    }
                }

                stores.currencies.setState(currencies);
            });
        };

        events?.on(WalletEvent.CurrencyChange, currenciesListener);

        const tokensListener = () => {
            getTokens(client, address).then((tokens) => {
                stores.tokens.setState(tokens);
            });
        };

        events?.on(WalletEvent.TokenMint, tokensListener);
        events?.on(WalletEvent.TokenBurn, tokensListener);

        const balanceChangeListener = (drops: string, xrp: string) => {
            // console.log(WalletEvent.BalanceChange, drops, xrp);
            stores.balance.setState(xrp);
        };

        events?.on(WalletEvent.BalanceChange, balanceChangeListener);

        const createBuyOfferListener = (
            index: string,
            tokenId: string,
            amount: Amount
        ) => {
            getBuyOffers(client, tokenId)
                .then((buyOffers) => {
                    stores.buyOffers.setState((state) => {
                        console.log(
                            'updating buy offers store: ',
                            { ...state },
                            [...buyOffers]
                        );
                        return {
                            ...state,
                            [tokenId]: buyOffers,
                        };
                    });
                })
                .catch((err) => {});
        };

        const createSellOfferListener = (
            index: string,
            tokenId: string,
            amount: Amount
        ) => {
            getSellOffers(client, tokenId)
                .then((sellOffers) => {
                    stores.sellOffers.setState((state) => {
                        console.log(
                            'updating buy offers store: ',
                            { ...state },
                            [...sellOffers]
                        );
                        return {
                            ...state,
                            [tokenId]: sellOffers,
                        };
                    });
                })
                .catch((err) => {});
        };

        const acceptOfferListener = (index: string, tokenId: string) => {
            console.log('accept offer triggered: ', index, tokenId);

            tokensListener();
            createBuyOfferListener(index, tokenId, '0');
            createSellOfferListener(index, tokenId, '0');
        };

        events?.on(WalletEvent.CreateBuyOffer, createBuyOfferListener);
        events?.on(WalletEvent.CreateSellOffer, createSellOfferListener);
        events?.on(WalletEvent.AcceptBuyOffer, acceptOfferListener);
        events?.on(WalletEvent.AcceptSellOffer, acceptOfferListener);

        return () => {
            events?.off(WalletEvent.CurrencyChange, currenciesListener);

            events?.off(WalletEvent.TokenMint, tokensListener);
            events?.off(WalletEvent.TokenBurn, tokensListener);

            events?.off(WalletEvent.BalanceChange, balanceChangeListener);

            events?.off(WalletEvent.CreateBuyOffer, createBuyOfferListener);
            events?.off(WalletEvent.CreateSellOffer, createSellOfferListener);

            events?.off(WalletEvent.AcceptBuyOffer, acceptOfferListener);
            events?.off(WalletEvent.AcceptSellOffer, acceptOfferListener);

            networkEmitter.removeAddress(address);
        };
    }, [address, stores]);

    return null;
}
