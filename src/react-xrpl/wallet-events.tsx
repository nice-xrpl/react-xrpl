import { useEffect } from 'react';
import { createWalletEventEmitter, Currency, WalletEvent } from './api';
import {
    getBalances,
    getBuyOffers,
    getSellOffers,
    getTokens,
} from './api/requests';
import { useWalletAddress, useWalletStores, useXRPLClient } from './hooks';

export function WalletEvents() {
    const client = useXRPLClient();
    const address = useWalletAddress();

    const {
        balance: balanceStore,
        currencies: currenciesStore,
        tokens: tokensStore,
        buyOffers: buyOffersStore,
        sellOffers: sellOffersStore,
    } = useWalletStores();

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
                            value: parseFloat(balance.value) ?? 0,
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
            // console.log(WalletEvent.BalanceChange, drops, xrp);
            balanceStore.setState(xrp);
        };

        events.on(WalletEvent.BalanceChange, balanceChangeListener);

        const createBuyOfferListener = (
            index: string,
            tokenId: string,
            amount: string
        ) => {
            getBuyOffers(client, tokenId)
                .then((buyOffers) => {
                    buyOffersStore.setState((state) => {
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
            amount: string
        ) => {
            getSellOffers(client, tokenId)
                .then((sellOffers) => {
                    sellOffersStore.setState((state) => {
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

        events.on(WalletEvent.CreateBuyOffer, createBuyOfferListener);
        events.on(WalletEvent.CreateSellOffer, createSellOfferListener);
        events.on(WalletEvent.AcceptBuyOffer, acceptOfferListener);
        events.on(WalletEvent.AcceptSellOffer, acceptOfferListener);

        events.start();

        return () => {
            events.off(WalletEvent.CurrencyChange, currenciesListener);

            events.off(WalletEvent.TokenMint, tokensListener);
            events.off(WalletEvent.TokenBurn, tokensListener);

            events.off(WalletEvent.BalanceChange, balanceChangeListener);

            events.off(WalletEvent.CreateBuyOffer, createBuyOfferListener);
            events.off(WalletEvent.CreateSellOffer, createSellOfferListener);

            events.off(WalletEvent.AcceptBuyOffer, acceptOfferListener);
            events.off(WalletEvent.AcceptSellOffer, acceptOfferListener);

            events.stop();
        };
    }, [client, address]);

    return null;
}
