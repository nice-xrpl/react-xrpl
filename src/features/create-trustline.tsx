import { useState } from 'react';
import { useCreateTrustline } from 'react-xrpl';

export function CreateTrustline() {
    const createTrustline = useCreateTrustline();

    const [destinationAddress, setDestinationAddress] = useState('');
    const [amount, setAmount] = useState(48);
    const [sending, setSending] = useState(false);

    return (
        <div>
            Create trustline to{' '}
            <input
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.currentTarget.value)}
                type="text"
            />{' '}
            with a limit of{' '}
            <input
                value={amount}
                onChange={(e) => setAmount(parseInt(e.currentTarget.value, 10))}
                type="number"
            />{' '}
            USD -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        const result = await createTrustline(
                            destinationAddress,
                            'USD',
                            `${amount}`
                        );
                        setSending(false);
                        console.log(result);
                        setAmount(48);
                    }}
                >
                    Send
                </button>
            )}
        </div>
    );
}
