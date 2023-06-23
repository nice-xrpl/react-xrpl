import { useState } from "react";
import { useSendCurrency } from "react-xrpl";

export function SendCurrency() {
    const sendCurrency = useSendCurrency();

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
            USD to{' '}
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
                        const result = await sendCurrency(
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