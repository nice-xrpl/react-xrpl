import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';
import { getTokens } from './requests/get-tokens';
import { Currency, OfferStore, WalletInitialState } from './wallet-types';
import {
    getTransactions,
    processTransactions,
} from './requests/get-transactions';
import { getBalances } from './requests';

export function createWallet(seed?: string) {
    if (seed) {
        return xrplWallet.fromSeed(seed);
    }

    return xrplWallet.generate();
}

export async function createAndFundWallet(
    client: xrplClient,
    amount: string = '1000'
): Promise<xrplWallet> {
    await client.connect();

    const { wallet } = await client.fundWallet(null, {
        amount,
    });

    return wallet;
}

export async function getInitialWalletState(
    client: xrplClient,
    address: string
): Promise<WalletInitialState> {
    const [initialBalance, initialCurrencies] = await getBalances(
        client,
        address
    );
    const initialTokens = await getTokens(client, address);

    let initialBuyOffers: OfferStore = {};
    let initialSellOffers: OfferStore = {};

    for (const token of initialTokens) {
        initialBuyOffers[token.id] = [];
        initialSellOffers[token.id] = [];
    }

    return {
        balance: initialBalance,
        currencies: initialCurrencies,
        tokens: initialTokens,
        buyOffers: {},
        sellOffers: {},
    };
}
