import { useState } from 'react';
import { Wallet, useCreateAndFundWallet } from 'react-xrpl';
import { WalletUI } from './wallet-ui';

export function CreateNewWallet() {
    const [seed, setSeed] = useState('');
    const [sending, setSending] = useState(false);

    const createAndFundWallet = useCreateAndFundWallet();

    return !seed ? (
        <div>
            {!sending ? (
                <button
                    onClick={async () => {
                        setSending(true);
                        const wallet = await createAndFundWallet('1000000');

                        setSending(false);

                        if (wallet.seed) {
                            console.log('created wallet: ', wallet);
                            setSeed(wallet.seed);
                        }
                    }}
                >
                    Create a random wallet
                </button>
            ) : (
                'Creating wallet...'
            )}
        </div>
    ) : (
        <div>Wallet seed: {seed}</div>
    );
}
