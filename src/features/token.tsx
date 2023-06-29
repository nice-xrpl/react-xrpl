import { useState } from 'react';
import { Offer, useGetBuyOffers, useGetSellOffers } from 'react-xrpl';
import Offers from './offers';

type TokenProps = {
    id: string;
    uri: string;
};

export function Token({ id, uri }: TokenProps) {
    const [buyOffers, setBuyOffers] = useState<Offer[]>([]);
    const [sellOffers, setSellOffers] = useState<Offer[]>([]);
    const [buyLoading, setBuyLoading] = useState(false);
    const [sellLoading, setSellLoading] = useState(false);

    const getBuyOffers = useGetBuyOffers();
    const getSellOffers = useGetSellOffers();

    return (
        <div key={id}>
            {/* {token.issuer}{' - '} */}
            {id}
            {': '}
            {uri}
            {' - '}
            <button
                onClick={async () => {
                    if (buyLoading || sellLoading) {
                        return;
                    }

                    setBuyLoading(true);

                    try {
                        const buyOffers = await getBuyOffers(id);
                        setBuyOffers(buyOffers);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        setBuyLoading(false);
                    }

                    try {
                        const sellOffers = await getSellOffers(id);
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
            {buyOffers.length || sellOffers.length ? (
                <Offers buyOffers={buyOffers} sellOffers={sellOffers} />
            ) : null}
        </div>
    );
}
