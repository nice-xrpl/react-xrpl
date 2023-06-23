import { useBalance } from 'react-xrpl';

export function WalletBalance() {
    const balance = useBalance();

    return <div>Balance: {balance}</div>;
}
