import { useState } from 'react';
import { useSendXRP } from 'react-xrpl';

export function SendXRP() {
    const sendXRP = useSendXRP();

    const [destinationAddress, setDestinationAddress] = useState('');
    const [amount, setAmount] = useState(48);
    const [sending, setSending] = useState(false);

    return (
        <div>
            Send{' '}
            <input
                value={amount}
                onChange={(e) => setAmount(parseInt(e.currentTarget.value, 10))}
                type="number"
            />{' '}
            XRP to{' '}
            <input
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.currentTarget.value)}
                type="text"
            />{' '}
            -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        const result = await sendXRP(
                            destinationAddress,
                            amount
                        );
                        setSending(false);
                        console.log('UI: ', result);
                        setAmount(48);
                    }}
                >
                    Send
                </button>
            )}
        </div>
    );
}
