import { Client as xrplClient } from 'xrpl';
import { Currency } from '../wallet-types';

/**
 * Retrieves the balances of a given address from the XRP Ledger using the provided client.
 *
 * @param {xrplClient} client - The client used to connect to the XRP Ledger.
 * @param {string} address - The address to retrieve balances for.
 * @return {Promise<[string, Currency[]]>} A promise that resolves to an array containing the initial balance and an array of Currency objects representing the balances of the address.
 */
export async function getBalances(
    client: xrplClient,
    address: string
): Promise<[string, Currency[]]> {
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

    return [initialBalance, initialCurrencies];
}
