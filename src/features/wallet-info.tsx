import { useWallet } from "react-xrpl";

export function WalletInfo() {
    const wallet = useWallet();

    return (
        <div>
            <div>Address: {wallet.address}</div>
            <div>Seed: {wallet.seed}</div>
        </div>
    );
}