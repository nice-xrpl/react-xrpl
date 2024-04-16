import { CreateNewWallet } from './features/create-new-wallet';
import { LoadWalletFromSeed } from './features/load-wallet-from-seed';
import { LoadWalletFromAddress } from './features/load-wallet-from-address';
import './app.css';
import { useIsConnected, useTransactionLog, XRPLClient } from 'react-xrpl';
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
                        'rBAdK7eR3oqvi5AQCEZFKtG3qizwRxnnFp',
                        'r9g9XGCX4cQAJjfko1jemKMbRYma2QdFJP',
                    ]}
                />
            </div>

            <div>
                <LoadWalletFromSeed seed={'sEd7cUM9hqM6Ly6uvG7FU9YguzsTwg7'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdVExhLMoRWkVArve9Hr9TMpNdjnEq'} />
            </div>
            {/* <div>
                <LoadWalletFromSeed seed={'sEdTQ1D4LuYi1dbQ3ryHFpEX2emh3vW'} />
            </div> */}
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
