import { useState } from 'react';
import { useBurnToken, useGetTokens } from 'react-xrpl';

export function BurnNFT() {
    const burnToken = useBurnToken();
    const getTokens = useGetTokens();
    const [id, setId] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div>
            Burn an NFT by ID:{' '}
            <input value={id} onChange={(e) => setId(e.currentTarget.value)} />{' '}
            -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        const result = await burnToken(id);
                        console.log('UI: ', result);
                        const tokens = await getTokens();
                        console.log('UI: ', tokens);
                        setSending(false);
                        setId('');
                    }}
                >
                    Send
                </button>
            )}
        </div>
    );
}
