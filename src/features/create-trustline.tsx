import { useState } from 'react';
import { useCreateTrustline } from 'react-xrpl';

export function CreateTrustline() {
    const createTrustline = useCreateTrustline();

    const [destinationAddress, setDestinationAddress] = useState('');
    const [amount, setAmount] = useState(48);
    const [sending, setSending] = useState(false);
    const [currency, setCurrency] = useState('USD');

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
            <input
                value={currency}
                onChange={(e) => setCurrency(e.currentTarget.value)}
                type="text"
            />{' '}
            -{' '}
            {sending ? (
                'Waiting for response...'
            ) : (
                <button
                    onClick={async () => {
                        setSending(true);
                        const result = await createTrustline(
                            destinationAddress,
                            currency,
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
