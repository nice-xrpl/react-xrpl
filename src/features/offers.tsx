import { useState } from 'react';
import { Offer, useGetBuyOffers, useGetSellOffers } from 'react-xrpl';

type OffersProps = {
    buyOffers: Offer[];
    sellOffers: Offer[];
};

export default function Offers(
    { buyOffers, sellOffers }: OffersProps = {
        buyOffers: [],
        sellOffers: [],
    }
) {
    return (
        <div>
            <div>Buy Offers</div>
            {buyOffers.length ? (
                <>
                    {buyOffers.map((offer) => {
                        return (
                            <div key={offer.index}>
                                Offer Index <code>{offer.index}</code> for offer
                                amount {offer.amount}
                            </div>
                        );
                    })}
                </>
            ) : (
                <div>No buy offers</div>
            )}
            <div>Sell Offers</div>
            {sellOffers.length ? (
                <>
                    {sellOffers.map((offer) => {
                        return (
                            <div key={offer.index}>
                                Offer Index <code>{offer.index}</code> for offer
                                amount {offer.amount}
                            </div>
                        );
                    })}
                </>
            ) : (
                <div>No sell offers</div>
            )}
        </div>
    );
}
