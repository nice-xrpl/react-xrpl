import { AcceptBrokerOffer } from './accept-brokered-offer';
import { AcceptBuyOffer } from './accept-buy-nft';
import { AcceptSellOffer } from './accept-sell-nft';
import { BurnNFT } from './burn-nft';
import { BuyNFT } from './buy-nft';
import { CreateTrustline } from './create-trustline';
import { CurrencyBalance } from './currency-balance';
import { MintNFT } from './mint-nft';
import OffersById from './offers-by-id';
import { SellNFT } from './sell-nft';
import { SendCurrency } from './send-currency';
import { SendXRP } from './send-xrp';
import { ShowNFT } from './show-nft';
import { WalletBalance } from './wallet-balance';
import { WalletInfo } from './wallet-info';

export function WalletUI() {
    return (
        <div
            style={{
                border: '1px solid skyblue',
                margin: '10px',
                padding: '5px',
            }}
        >
            <WalletInfo />
            <WalletBalance />
            <CurrencyBalance />
            <SendXRP />
            <CreateTrustline />
            <SendCurrency />
            <MintNFT />
            <BurnNFT />
            <ShowNFT />
            <BuyNFT />
            <SellNFT />
            <OffersById />
            <AcceptBuyOffer />
            <AcceptSellOffer />
            <AcceptBrokerOffer />
        </div>
    );
}
