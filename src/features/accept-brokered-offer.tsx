import { useState } from 'react';
import { useAcceptBrokeredOffer } from 'react-xrpl';

export function AcceptBrokerOffer() {
    const acceptBrokeredOffer = useAcceptBrokeredOffer();
    const [buyOfferIndex, setBuyOfferIndex] = useState('');
    const [sellOfferIndex, setSellOfferIndex] = useState('');
    const [fee, setFee] = useState('');
    const [sending, setSending] = useState(false);

    return (
        <div className="WalletRow">
            Broker an offer with buy offer index{' '}
            <input
                value={buyOfferIndex}
                onChange={(e) => setBuyOfferIndex(e.currentTarget.value)}
            />{' '}
            and sell offer index{' '}
            <input
                value={sellOfferIndex}
                onChange={(e) => setSellOfferIndex(e.currentTarget.value)}
            />{' '}
            with a fee of{' '}
            <input
                value={fee}
                onChange={(e) => setFee(e.currentTarget.value)}
            />{' '}
            XRP (drops) -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        try {
                            const result = await acceptBrokeredOffer(
                                buyOfferIndex,
                                sellOfferIndex,
                                fee
                            );

                            console.log('UI: ', result);
                        } catch (err) {
                            // console.log("ERROR: ", err);
                        } finally {
                            setSending(false);
                            setBuyOfferIndex('');
                            setFee('');
                            setSellOfferIndex('');
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
