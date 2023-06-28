import { useState } from 'react';
import {
    useTokens,
    Offer,
    useGetBuyOffers,
    useGetSellOffers,
} from 'react-xrpl';

export function ShowNFT() {
    const tokens = useTokens();
    const [buyOffers, setBuyOffers] = useState<Offer[]>([]);
    const [sellOffers, setSellOffers] = useState<Offer[]>([]);

    const getBuyOffers = useGetBuyOffers();
    const getSellOffers = useGetSellOffers();

    return (
        <div>
            Tokens
            {tokens.map((token) => {
                return (
                    <div key={token.id}>
                        {/* {token.issuer}{' - '} */}
                        {token.id}
                        {': '}
                        {token.uri}
                        {' - '}
                        <button
                            onClick={async () => {
                                try {
                                    const buy = await getBuyOffers(token.id);

                                    setBuyOffers(buy);
                                } catch (err) {
                                    console.log(err);
                                }

                                try {
                                    const sell = await getSellOffers(token.id);

                                    setSellOffers(sell);
                                } catch (err) {
                                    console.log(err);
                                }
                            }}
                        >
                            Get offers
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
