import { useState } from 'react';
import { Offer, useGetBuyOffers, useGetSellOffers } from 'react-xrpl';

export default function Offers() {
    const [buyOffers, setBuyOffers] = useState<Offer[]>([]);
    const [sellOffers, setSellOffers] = useState<Offer[]>([]);
    const [buyLoading, setBuyLoading] = useState(false);
    const [sellLoading, setSellLoading] = useState(false);
    const [nftId, setNftId] = useState('');

    const getBuyOffers = useGetBuyOffers();
    const getSellOffers = useGetSellOffers();

    return (
        <div>
            Offers for NFT ID:{' '}
            <input
                type="text"
                value={nftId}
                onChange={(e) => setNftId(e.target.value)}
            />{' '}
            <button
                onClick={async () => {
                    if (buyLoading || sellLoading) {
                        return;
                    }

                    setBuyLoading(true);

                    try {
                        const buyOffers = await getBuyOffers(nftId);
                        setBuyOffers(buyOffers);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        setBuyLoading(false);
                    }

                    try {
                        const sellOffers = await getSellOffers(nftId);
                        setSellOffers(sellOffers);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        setSellLoading(false);
                    }
                }}
            >
                {buyLoading ? 'Waiting for response...' : 'Get Offers'}
            </button>
            {buyOffers.length ? (
                <>
                    <div>Buy Offers</div>
                    {buyOffers.map((offer) => {
                        return (
                            <div key={offer.id}>
                                Offer Index <code>{offer.id}</code> for offer
                                amount {offer.amount}
                            </div>
                        );
                    })}
                </>
            ) : null}
            {sellOffers.length ? (
                <>
                    <div>Sell Offers</div>
                    {sellOffers.map((offer) => {
                        return (
                            <div key={offer.id}>
                                Offer Index <code>{offer.id}</code> for offer
                                amount {offer.amount}
                            </div>
                        );
                    })}
                </>
            ) : null}
        </div>
    );
}
