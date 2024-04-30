import { Client as xrplClient, Wallet as xrplWallet } from 'xrpl';
import { getTokens } from './requests/get-tokens';
import { OfferStore, WalletInitialState } from './wallet-types';
import { getBalances } from './requests';

/**
 * Creates a new wallet based on the provided seed. If no seed is provided, a new wallet is generated.
 *
 * @param {string} [seed] - The seed used to create the wallet. Optional.
 * @return {Wallet} The created wallet.
 */
export function createWallet(seed?: string) {
    if (seed) {
        return xrplWallet.fromSeed(seed);
    }

    return xrplWallet.generate();
}

/**
 * Creates and funds a wallet.
 *
 * @param {xrplClient} client - The XRPL client used to connect.
 * @param {string} [amount='1000'] - The amount to fund the wallet with.
 * @return {Promise<xrplWallet>} The funded wallet.
 */
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

/**
 * Retrieves the initial state of a wallet including balance, currencies, tokens, buy offers, and sell offers.
 *
 * @param {xrplClient} client - The XRPL client used to retrieve the wallet state.
 * @param {string} address - The address of the wallet.
 * @return {Promise<WalletInitialState>} The initial state of the wallet including balance, currencies, tokens, buy offers, and sell offers.
 */
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
