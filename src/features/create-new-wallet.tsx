import { useState } from "react";
import { Wallet, useCreateWallet } from "react-xrpl";
import { WalletUI } from "./wallet-ui";

export function CreateNewWallet() {
    const [seed, setSeed] = useState('');
    const [sending, setSending] = useState(false);

    const createWallet = useCreateWallet();

    return !seed ? (
        <div>
            {!sending ? (
                <button
                    onClick={async () => {
                        setSending(true);
                        const wallet = await createWallet('1048');

                        setSending(false);

                        if (wallet.wallet.seed) {
                            console.log('created wallet: ', wallet);
                            setSeed(wallet.wallet.seed);
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
        <Wallet seed={seed}>
            <div>A randomly created wallet</div>
            <WalletUI />
        </Wallet>
    );
}
