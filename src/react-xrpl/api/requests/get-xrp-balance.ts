import { Client as xrplClient } from 'xrpl';

/**
 * Retrieves the XRP balance of a given address using the provided XRP client.
 *
 * @param {xrplClient} client - The XRP client used to connect to the XRP network.
 * @param {string} address - The address for which to retrieve the XRP balance.
 * @return {Promise<string>} - A promise that resolves to the XRP balance as a string.
 * @throws {Error} - If there is an error connecting to the XRP network or retrieving the balance.
 */
export async function getXRPBalance(client: xrplClient, address: string) {
    await client.connect();

    return await client.getXrpBalance(address);
}
