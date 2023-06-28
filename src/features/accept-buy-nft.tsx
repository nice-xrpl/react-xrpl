import { useState } from 'react';
import { useAcceptBuyOffer } from 'react-xrpl';

export function AcceptBuyOffer() {
    const acceptBuyOffer = useAcceptBuyOffer();
    const [offerIndex, setOfferIndex] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div>
            Accept a buy offer with index{' '}
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
                            const result = await acceptBuyOffer(offerIndex);

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
