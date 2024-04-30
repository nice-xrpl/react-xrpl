import { Client as xrplClient } from 'xrpl';
import { Offer } from '../wallet-types';

/**
 * Retrieves the sell offers for a specific token from the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {string} tokenId - The ID of the token for which sell offers are requested.
 * @return {Promise<Offer[]>} A promise that resolves to an array of Offer objects representing the sell offers for the specified token.
 */
export async function getSellOffers(client: xrplClient, tokenId: string) {
    await client.connect();

    const response = await client.request({
        command: 'nft_sell_offers',
        nft_id: tokenId,
    });

    let offers: Offer[] = [];

    for (const offer of response.result.offers) {
        offers.push({
            amount:
                typeof offer.amount === 'string'
                    ? offer.amount
                    : offer.amount.value,
            index: offer.nft_offer_index,
            owner: offer.owner,
            expiration: offer.expiration,
            destination: offer.destination,
        });
    }

    return offers;
}
