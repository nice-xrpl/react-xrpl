import { Client as xrplClient } from 'xrpl';
import { Offer } from '../wallet-types';

export async function getBuyOffers(client: xrplClient, tokenId: string) {
	await client.connect();

	const response = await client.request({
		command: 'nft_buy_offers',
		nft_id: tokenId
	});

	let offers: Offer[] = [];

	for (const offer of response.result.offers) {
		offers.push({
			amount: typeof offer.amount === 'string' ? offer.amount : offer.amount.value,
			id: offer.nft_offer_index,
			owner: offer.owner,
			expiration: offer.expiration,
			destination: offer.destination,
		});
	}

	return offers;
}