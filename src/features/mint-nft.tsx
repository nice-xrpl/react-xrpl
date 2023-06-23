import { useState } from 'react';
import { useGetTokens, useMintToken } from 'react-xrpl';

export function MintNFT() {
    const mintToken = useMintToken();
    const getTokens = useGetTokens();
    const [url, setUrl] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div>
            Mint an NFT with data:{' '}
            <input
                value={url}
                onChange={(e) => setUrl(e.currentTarget.value)}
            />{' '}
            -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        const result = await mintToken(url, 1);
                        console.log('UI: ', result);
                        const tokens = await getTokens();
                        console.log('UI: ', tokens);
                        setSending(false);
                        setUrl('');
                    }}
                >
                    Send
                </button>
            )}
        </div>
    );
}
