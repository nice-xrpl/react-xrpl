import { CreateNewWallet } from './features/create-new-wallet';
import { LoadWalletFromSeed } from './features/load-wallet-from-seed';
import './app.css';
import { Networks, useIsConnected, XRPLClient } from 'react-xrpl';
import { TransactionLog } from './features/transaction-log';
import { LoadWalletFromAddress } from './features/load-wallet-from-address';
import { useState } from 'react';

const accounts = [
    'none',
    'rGMdgBqKPjbv6yePGEYT6WCT6fpDJWgDFK',
    'rwkdEdhB42A3L3SvmLRizVcVReUwQ6Wvnw',
    'rEtkocNu11gZTEeLX6S5cbJHjqPpNnJRyu',
    'rEayvcRT4YG5H4DHCGnz5NZB1PnvkPYEfU',
];

function MainApp() {
    const isConnected = useIsConnected();
    const [activeAccount, setActiveAccount] = useState<string[]>([]);

    return (
        <div className="App">
            <div>
                Client connected to ripple: {isConnected ? 'true' : 'false'}
            </div>
            <div>
                <CreateNewWallet />
            </div>

            <div>
                Selected Log:
                <select
                    value={activeAccount}
                    onChange={(e) => {
                        if (e.target.value === 'none') {
                            setActiveAccount([]);
                        } else {
                            setActiveAccount([e.target.value]);
                        }
                    }}
                >
                    {accounts.map((account) => (
                        <option key={account} value={account}>
                            {account}
                        </option>
                    ))}
                </select>
                <TransactionLog account={activeAccount} />
            </div>

            <div>
                Empty Log:
                <TransactionLog account={[]} />
            </div>

            <div>
                <LoadWalletFromSeed seed={'sEdVS6hUP7VEJ2sTVFMZy69TE3Ytuei'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdTwNVqhk822cCC8TXiPC5W753URg1'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdVpBMk48hDTdjuLuRPNgqHjsvVsmH'} />
            </div>
            <div>
                <LoadWalletFromAddress
                    address={'rEayvcRT4YG5H4DHCGnz5NZB1PnvkPYEfU'}
                />
            </div>
        </div>
    );
}

function App() {
    return (
        <XRPLClient network={Networks.Devnet}>
            <MainApp />
        </XRPLClient>
    );
}

export default App;
