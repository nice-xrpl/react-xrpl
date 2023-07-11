import { useState } from 'react';
import {
    useBuyOffers,
    useGetBuyOffers,
    useGetSellOffers,
    useSellOffers,
} from 'react-xrpl';
import Offers from './offers';

function ShowOffers({ id }: { id: string }) {
    const buyOffers = useBuyOffers(id);
    const sellOffers = useSellOffers(id);

    console.log(buyOffers, sellOffers);

    if (buyOffers?.length || sellOffers?.length) {
        return <Offers buyOffers={buyOffers} sellOffers={sellOffers} />;
    }

    return null;
}

export default function OffersById() {
    const [buyLoading, setBuyLoading] = useState(false);
    const [sellLoading, setSellLoading] = useState(false);
    const [inputNftId, setInputNftId] = useState('');
    const [nftId, setNftId] = useState('');

    const getBuyOffers = useGetBuyOffers();
    const getSellOffers = useGetSellOffers();

    return (
        <div>
            Offers for NFT ID:{' '}
            <input
                type="text"
                value={inputNftId}
                onChange={(e) => setInputNftId(e.target.value)}
            />{' '}
            <button
                onClick={async () => {
                    if (buyLoading || sellLoading) {
                        return;
                    }

                    setBuyLoading(true);
                    setSellLoading(true);

                    try {
                        await getBuyOffers(inputNftId);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        setBuyLoading(false);
                    }

                    try {
                        await getSellOffers(inputNftId);
                    } catch (e) {
                        console.log(e);
                    } finally {
                        setSellLoading(false);
                    }

                    setNftId(inputNftId);
                }}
            >
                {buyLoading || sellLoading
                    ? 'Waiting for response...'
                    : 'Get Offers'}
            </button>
            {nftId ? <ShowOffers id={nftId} /> : null}
        </div>
    );
}
