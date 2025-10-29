import { CreateNewWallet } from './features/create-new-wallet';
import { LoadWalletFromSeed } from './features/load-wallet-from-seed';
import './app.css';
import { useIsConnected, XRPLClient } from 'react-xrpl';
import { TransactionLog } from './features/transaction-log';

function MainApp() {
    const isConnected = useIsConnected();

    return (
        <div className="App">
            <div>
                Client connected to ripple: {isConnected ? 'true' : 'false'}
            </div>
            <div>
                <CreateNewWallet />
            </div>

            <div>
                Combined Log:
                <TransactionLog
                    account={[
                        'rQECgtBN5pV9awN6Li24kMAyQZVqTzhHGG',
                        'rKmrRjaKo6V8ZfJndM6JiC4SVkRbkCneif',
                    ]}
                />
            </div>

            <div>
                Empty Log:
                <TransactionLog account={[]} />
            </div>

            <div>
                <LoadWalletFromSeed seed={'sEd7hhRKjF5Wysi5WZe9zhkPaSTVSvd'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdTSE75avHq6YVeQvWaphXjyRQjcRu'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdTJqiJie8PtqHEUEPkQKJQw2Aobnh'} />
            </div>
        </div>
    );
}

function App() {
    return (
        <XRPLClient>
            <MainApp />
        </XRPLClient>
    );
}

export default App;
