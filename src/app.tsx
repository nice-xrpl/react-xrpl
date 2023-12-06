import { CreateNewWallet } from './features/create-new-wallet';
import { LoadWalletFromSeed } from './features/load-wallet-from-seed';
import { LoadWalletFromAddress } from './features/load-wallet-from-address';
import './app.css';
import { useIsConnected, useTransactionLog, XRPLClient } from 'react-xrpl';
import { TransactionLog } from './features/transaction-log';

function MainApp() {
    const isConnected = useIsConnected();
    // const log = useTransactionLog('r4kpAq7NYMdKq2WX28htLGrSxuPownzjPG');

    return (
        <div className="App">
            <div>
                Client connected to ripple: {isConnected ? 'true' : 'false'}
            </div>
            <div>
                <CreateNewWallet />
            </div>
            <div>
                <div>
                    Sample Log:
                    <TransactionLog account="r4kpAq7NYMdKq2WX28htLGrSxuPownzjPG" />
                </div>
                <LoadWalletFromSeed seed={'sEdVdkpAdtRJu2MRq5qb6Z7Vf5oNn5t'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdT2SsT7dadAscvgf9DL83evmaH8yT'} />
            </div>
            {/* <div>
                <LoadWalletFromAddress
                    address={'rBCHWcsWPgXfrNoASakKiZx5dbynHibezb'}
                />
            </div> */}
            <div>
                <LoadWalletFromSeed seed={'sEdTxZceWFkoZpB9pYkTGrHJgrFbycD'} />
            </div>
            <div>
                <LoadWalletFromSeed seed={'sEdSRnqJ7d3HCyM3BTt4rAmod4cUUGQ'} />
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
