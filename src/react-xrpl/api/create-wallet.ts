import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';
import { getTokens } from './requests/get-tokens';
import {
    Currency,
    WalletInitialState,
    XRPLWalletInitialState,
} from './wallet-types';

export async function createWallet(
    client: xrplClient,
    amount: string = '1024'
): Promise<XRPLWalletInitialState> {
    await client.connect();

    const { wallet } = await client.fundWallet(null, {
        amount,
    });

    const intialState = await getInitialWalletState(client, wallet.address);

    return {
        wallet,
        ...intialState,
    };
}

export async function createWalletFromSeed(
    client: xrplClient,
    seed: string
): Promise<XRPLWalletInitialState> {
    await client.connect();

    const wallet = xrplWallet.fromSeed(seed);

    const intialState = await getInitialWalletState(client, wallet.address);

    return {
        wallet,
        ...intialState,
    };
}

export async function getInitialWalletState(
    client: xrplClient,
    address: string
): Promise<WalletInitialState> {
    await client.connect();

    const balances = await client.getBalances(address);

    let initialBalance = 0;
    let initialCurrencies: Currency[] = [];

    for (const balance of balances) {
        if (balance.currency === 'XRP') {
            initialBalance = parseFloat(balance.value) ?? 0;
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

    return {
        balance: initialBalance,
        currencies: initialCurrencies,
        tokens: initialTokens,
        buyOffers: [],
        sellOffers: [],
    };
}
