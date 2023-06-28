import { useState } from 'react';
import { useAcceptSellOffer } from 'react-xrpl';

export function AcceptSellOffer() {
    const acceptSellOffer = useAcceptSellOffer();
    const [offerIndex, setOfferIndex] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div>
            Accept a sell offer with index{' '}
            <input
                value={offerIndex}
                onChange={(e) => setOfferIndex(e.currentTarget.value)}
            />{' '}
            -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        try {
                            const result = await acceptSellOffer(offerIndex);

                            console.log('UI: ', result);
                        } catch (err) {
                            console.log('ERROR: ', err);
                        } finally {
                            setSending(false);
                            setOfferIndex('');
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
