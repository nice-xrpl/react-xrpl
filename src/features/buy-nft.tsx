import { useState } from 'react';
import { useCreateBuyOffer } from 'react-xrpl';

export function BuyNFT() {
    const createBuyOffer = useCreateBuyOffer();
    const [tokenId, setTokenId] = useState('');
    const [owner, setOwner] = useState('');
    const [amount, setAmount] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div>
            Create Buy offer for NFT with ID{' '}
            <input
                value={tokenId}
                onChange={(e) => setTokenId(e.currentTarget.value)}
            />{' '}
            owned by{' '}
            <input
                value={owner}
                onChange={(e) => setOwner(e.currentTarget.value)}
            />{' '}
            for{' '}
            <input
                value={amount}
                onChange={(e) => setAmount(e.currentTarget.value)}
            />{' '}
            -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        try {
                            const result = await createBuyOffer(
                                owner,
                                tokenId,
                                amount
                            );

                            console.log('UI: ', result);
                        } catch (err) {
                            console.log('ERROR: ', err);
                        } finally {
                            setSending(false);
                            setTokenId('');
                            setOwner('');
                            setAmount('');
                        }

                        // const tokens = await getTokens();
                        // console.log('UI: ', tokens);
                    }}
                >
                    Send
                </button>
            )}
        </div>
    );
}
