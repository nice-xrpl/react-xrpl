import { BurnNFT } from './burn-nft';
import { CreateTrustline } from './create-trustline';
import { CurrencyBalance } from './currency-balance';
import { MintNFT } from './mint-nft';
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
        </div>
    );
}
