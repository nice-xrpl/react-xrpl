import { useState } from 'react';
import { ReadOnlyWalletUI } from './read-only-wallet-ui';
import { Account } from 'react-xrpl';

export function LoadWalletFromAddress({
    address: inputAddress,
}: {
    address: string;
}) {
    const [address, setAddress] = useState(inputAddress);
    const [input, setInput] = useState('');

    return address ? (
        <Account address={address}>
            <div>A requests only wallet from an address</div>
            <ReadOnlyWalletUI />
        </Account>
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
