import { useEffect } from 'react';
import { useWalletAddress, useXRPLClient } from './hooks';
import { Currency } from './api';
import { useNetworkEmitter } from './hooks/use-network-emitter';
import {
    getBalances,
    getBuyOffers,
    getSellOffers,
    getTokens,
} from './api/requests';
import { WalletEvents } from './api/network-emitter';
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

        const currencyChangeOff = networkEmitter.on(
            address,
            WalletEvents.CurrencyChange,
            currenciesListener
        );

        const tokensListener = () => {
            getTokens(client, address).then((tokens) => {
                stores.tokens.setState(tokens);
            });
        };

        const tokenMintOff = networkEmitter.on(
            address,
            WalletEvents.TokenMint,
            tokensListener
        );
        const tokenBurnOff = networkEmitter.on(
            address,
            WalletEvents.TokenBurn,
            tokensListener
        );

        const balanceChangeListener = (drops: string, xrp: number) => {
            // console.log(WalletEvent.BalanceChange, drops, xrp);
            stores.balance.setState(`${xrp}`);
        };

        const balanceChangeOff = networkEmitter.on(
            address,
            WalletEvents.BalanceChange,
            balanceChangeListener
        );

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

        const createBuyOfferOff = networkEmitter.on(
            address,
            WalletEvents.CreateBuyOffer,
            createBuyOfferListener
        );
        const createSellOfferOff = networkEmitter.on(
            address,
            WalletEvents.CreateSellOffer,
            createSellOfferListener
        );
        const acceptBuyOfferOff = networkEmitter.on(
            address,
            WalletEvents.AcceptBuyOffer,
            acceptOfferListener
        );
        const acceptSellOfferOff = networkEmitter.on(
            address,
            WalletEvents.AcceptSellOffer,
            acceptOfferListener
        );

        return () => {
            currencyChangeOff();
            tokenMintOff();
            tokenBurnOff();
            balanceChangeOff();
            createBuyOfferOff();
            createSellOfferOff();
            acceptBuyOfferOff();
            acceptSellOfferOff();
        };
    }, [address, stores]);

    return null;
}
