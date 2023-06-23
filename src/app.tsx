import { CreateNewWallet } from './features/create-new-wallet';
import { LoadWalletFromSeed } from './features/load-wallet-from-seed';
import { LoadWalletFromAddress } from './features/load-wallet-from-address';
import './app.css';
import { useIsConnected, XRPLClient } from 'react-xrpl';

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
                <LoadWalletFromSeed seed={'sEdT2SsT7dadAscvgf9DL83evmaH8yT'} />
            </div>
            <div>
                <LoadWalletFromAddress
                    address={'rBCHWcsWPgXfrNoASakKiZx5dbynHibezb'}
                />
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
