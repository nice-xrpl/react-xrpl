import { useWalletAddress } from 'react-xrpl';
import { WalletBalance } from './wallet-balance';
import { CurrencyBalance } from './currency-balance';
import { ShowNFT } from './show-nft';

export function ReadOnlyWalletUI() {
    const address = useWalletAddress();

    return (
        <div
            style={{
                border: '1px solid skyblue',
                margin: '10px',
                padding: '5px',
            }}
        >
            <div>
                <div>Address: {address}</div>
            </div>
            <WalletBalance />
            <CurrencyBalance />
            <ShowNFT />
        </div>
    );
}
