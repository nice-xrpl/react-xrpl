import { Client as xrplClient } from 'xrpl';
import { Currency } from '../wallet-types';

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
