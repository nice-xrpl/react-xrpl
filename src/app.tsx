import { Wallet } from "./react-xrpl/wallet";
import { XRPLClient } from "./react-xrpl/client";
import { useState } from "react";
import './app.css';
import { useCreateWallet, useIsConnected, useWallet, useWalletAddress } from "./react-xrpl/hooks";
import { useBalance, useCurrencyBalance, useGetTokens, useTokens } from "./react-xrpl/hooks/requests";
import { useBurnToken, useCreateTrustline, useMintToken, useSendCurrency, useSendXRP } from "./react-xrpl/hooks/transactions";
import { WalletAddress } from "./react-xrpl/wallet-address";

function WalletInfo() {
  const wallet = useWallet();
  
  return (
    <div>
      <div>Address: {wallet.address}</div>
      <div>Seed: {wallet.seed}</div>
    </div>
  )
}

function WalletBalance() {
  const balance = useBalance();

  return (
    <div>Balance: {balance}</div>
  );
}

function CurrencyBalance() {
  const currencies = useCurrencyBalance();

  return (
    <div>
      {currencies.map((currency) => {
        return <div key={currency.issuer}>{currency.value}{' '}{currency.currency}</div>
      })}
    </div>
  );
}

function SendXRP() {
  const sendXRP = useSendXRP();

  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState(48);
  const [sending, setSending] = useState(false);

  return (
  <div>
        Send{" "}
        <input
          value={amount}
          onChange={(e) => setAmount(parseInt(e.currentTarget.value, 10))}
          type="number"
        />{" "}
        XRP to{" "}
        <input
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.currentTarget.value)}
          type="text"
        />{" "}
        -{" "}
        {sending ? (
          "Waiting for response..."
        ) : (
          <button
            onClick={async () => {
              setSending(true);
              const result = await sendXRP(destinationAddress, amount);
              setSending(false);
              console.log('UI: ', result);
              setAmount(48);
            }}
          >
            Send
          </button>
        )}
      </div>
  );
}

function CreateTrustline() {
  const createTrustline = useCreateTrustline();

  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState(48);
  const [sending, setSending] = useState(false);

  return (
    <div>
        Create trustline to{" "}
        <input
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.currentTarget.value)}
          type="text"
        />{" "}with a limit of{" "}
        <input
          value={amount}
          onChange={(e) => setAmount(parseInt(e.currentTarget.value, 10))}
          type="number"
        />{' '}USD{" "}
        -{" "}
        {sending ? (
          "Waiting for response..."
        ) : (
          <button
            onClick={async () => {
              setSending(true);
              const result = await createTrustline(destinationAddress, 'USD', `${amount}`);
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

function SendCurrency() {
  const sendCurrency = useSendCurrency();

  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState(48);
  const [sending, setSending] = useState(false);

  return (
    <div>
        Send{" "}
        <input
          value={amount}
          onChange={(e) => setAmount(parseInt(e.currentTarget.value, 10))}
          type="number"
        />{" "}
        USD to{" "}
        <input
          value={destinationAddress}
          onChange={(e) => setDestinationAddress(e.currentTarget.value)}
          type="text"
        />{" "}
        -{" "}
        {sending ? (
          "Waiting for response..."
        ) : (
          <button
            onClick={async () => {
              setSending(true);
              const result = await sendCurrency(destinationAddress, 'USD', `${amount}`);
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

function MintNFT() {
  const mintToken = useMintToken();
  const getTokens = useGetTokens();
  const [url, setUrl] = useState('');
  const [sending, setSending] = useState(false);

  return (
    <div>
      Mint an NFT with data: <input value={url} onChange={(e) => setUrl(e.currentTarget.value)} />{" "}-{" "}{sending ? (
          "Waiting for response..."
        ) : (
          <button
            onClick={async () => {
              setSending(true);
              const result = await mintToken(url, 1);
              console.log('UI: ', result);
              const tokens = await getTokens();
              console.log('UI: ', tokens);
              setSending(false);
              setUrl('');
            }}
          >
            Send
          </button>
        )}
    </div>
  );
}

function ShowNFT() {
  const tokens = useTokens();

  return (
    <div>
      Tokens
      {tokens.map((token) => {
        return <div key={token.id}>{/* {token.issuer}{' - '} */}{token.id}{': '}{token.uri}</div>
      })}
    </div>
  );
}

function BurnNFT() {
  const burnToken = useBurnToken();
  const getTokens = useGetTokens();
  const [id, setId] = useState('');
  const [sending, setSending] = useState(false);

  return (
    <div>
      Burn an NFT by ID: <input value={id} onChange={(e) => setId(e.currentTarget.value)} />{" "}-{" "}{sending ? (
          "Waiting for response..."
        ) : (
          <button
            onClick={async () => {
              setSending(true);
              const result = await burnToken(id);
              console.log('UI: ', result);
              const tokens = await getTokens();
              console.log('UI: ', tokens);
              setSending(false);
              setId('');
            }}
          >
            Send
          </button>
        )}
    </div>
  );
}

function WalletUI() {
  return (
    <div
      style={{
        border: "1px solid skyblue",
        margin: "10px",
        padding: "5px"
      }}
    >
      <WalletInfo />
      <WalletBalance />
      <CurrencyBalance />
      <SendXRP />
      <CreateTrustline />
      <SendCurrency />    
      <MintNFT />
      <BurnNFT />
      <ShowNFT />
    </div>
  );
}

function CreateNewWallet() {
  const [seed, setSeed] = useState('');
  const [sending, setSending] = useState(false);

  const createWallet = useCreateWallet();

  return !seed ? (
    <div>
      {!sending ? <button
        onClick={async () => {
          setSending(true);
          const wallet = await createWallet('1048');
          
          setSending(false);

          if (wallet.wallet.seed) {
            console.log('created wallet: ', wallet);
            setSeed(wallet.wallet.seed);
          }
        }}
      >
        Create a random wallet
      </button> : 'Creating wallet...'}
    </div>
  ) : (
    <Wallet seed={seed}>
      <div>A randomly created wallet</div>
      <WalletUI />
    </Wallet>
  );
}

function LoadWalletFromSeed({seed: inputSeed}: {seed: string}) {
  const [seed, setSeed] = useState(inputSeed);
  const [input, setInput] = useState("");

  return seed ? (
    <Wallet seed={seed}>
      <div>A wallet from a seed</div>
      <WalletUI />
    </Wallet>
  ) : (
    <div>
      Enter a seed:{" "}
      <input value={input} onChange={(e) => setInput(e.currentTarget.value)} />{" "}
      <button
        onClick={() => {
          setSeed(input);
        }}
      >
        Load Wallet
      </button>
    </div>
  );
}

function ReadOnlyWalletUI() {
  const address = useWalletAddress();

  return (
    <div
      style={{
        border: "1px solid skyblue",
        margin: "10px",
        padding: "5px"
      }}
    >
      <div>
        <div>Address: {address}</div>
      </div>
      <WalletBalance />
      <CurrencyBalance />
      <ShowNFT />
    </div>
  );;
}

function LoadWalletFromAddress({address: inputAddress}: {address: string}) {
  const [address, setAddress] = useState(inputAddress);
  const [input, setInput] = useState("");

  return address ? (
    <WalletAddress address={address}>
      <div>A requests only wallet from an address</div>
      <ReadOnlyWalletUI />
    </WalletAddress>
  ) : (
    <div>
      Enter a seed:{" "}
      <input value={input} onChange={(e) => setInput(e.currentTarget.value)} />{" "}
      <button
        onClick={() => {
          setAddress(input);
        }}
      >
        Load Wallet
      </button>
    </div>
  );
}


function MainApp() {
  const isConnected = useIsConnected();

  return (
    <div className="App">
      <div>Client connected to ripple: {isConnected ? "true" : "false"}</div>
      <div>
        <CreateNewWallet />
      </div>
      <div>
        <LoadWalletFromSeed seed={'sEdT2SsT7dadAscvgf9DL83evmaH8yT'}/>
      </div>
      <div>
        <LoadWalletFromAddress address={'rBCHWcsWPgXfrNoASakKiZx5dbynHibezb'}/>
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
