import { useState } from "react";
import { WalletAddress } from "react-xrpl";
import { ReadOnlyWalletUI } from "./read-only-wallet-ui";

export function LoadWalletFromAddress({ address: inputAddress }: { address: string }) {
    const [address, setAddress] = useState(inputAddress);
    const [input, setInput] = useState('');

    return address ? (
        <WalletAddress address={address}>
            <div>A requests only wallet from an address</div>
            <ReadOnlyWalletUI />
        </WalletAddress>
    ) : (
        <div>
            Enter a seed:{' '}
            <input
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
            />{' '}
            <button
                onClick={() => {
                    setAddress(input);
                }}
            >
                Load Wallet
            </button>
        </div>
    );
}