import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';
import { getTokens } from './requests/get-tokens';
import {
    Currency,
    OfferStore,
    WalletInitialState,
    XRPLWalletInitialState,
} from './wallet-types';

export function createWallet(client: xrplClient, seed?: string) {
    if (seed) {
        return xrplWallet.fromSeed(seed);
    }

    return xrplWallet.generate();
}

export async function createAndFundWallet(
    client: xrplClient,
    amount: string = '1024'
): Promise<xrplWallet> {
    await client.connect();

    const { wallet } = await client.fundWallet(null, {
        amount,
    });

    // const intialState = await getInitialWalletState(client, wallet.address);

    // return {
    //     wallet,
    //     ...intialState,
    // };

    return wallet;
}

// export async function createWalletFromSeed(
//     client: xrplClient,
//     seed: string
// ): Promise<xrplWallet> {
//     await client.connect();

//     const wallet = xrplWallet.fromSeed(seed);

//     // const intialState = await getInitialWalletState(client, wallet.address);

//     // return {
//     //     wallet,
//     //     ...intialState,
//     // };

//     return wallet;
// }

export async function getInitialWalletState(
    client: xrplClient,
    address: string
): Promise<WalletInitialState> {
    await client.connect();

    const balances = await client.getBalances(address);

    let initialBalance = '';
    let initialCurrencies: Currency[] = [];

    for (const balance of balances) {
        if (balance.currency === 'XRP') {
            initialBalance = balance.value;
        }

        if (balance.issuer) {
            initialCurrencies.push({
                currency: balance.currency,
                issuer: balance.issuer,
                value: parseFloat(balance.value) ?? 0,
            });
        }
    }

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
