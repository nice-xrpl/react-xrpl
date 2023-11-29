# react-xrpl
React-xrpl is a set of hooks and components for creating applications using xrpl.js in React.  This library abstracts away parts of the xrpl.js API in order to provide a set of reactive hooks and components to interact with wallets complete with escape hatches to use the native API if needed!

# Getting Started

	npm install react-xrpl

This will install the library and all dependencies.  In order to simplify installation and not require changes to any of your tooling configuration (webpack, vite, etc.), we have opted to include and bundle the xrpl.js library with react-xrpl.  Please keep this in mind if you have installed xrpl.js separately, as react-xrpl will NOT use it.  We are working to alleviate this requirement and allow xrpl.js as a peer dependency.

NOTE: V1 is a major breaking change from older 0.0.x releases.

## Your first application

Any components that make use of any provided hooks/components need to be wrapped in a client.

	import { XRPLClient } from '@nice-xrpl/react-xrpl';

	function Main() {
		return (
			<XRPLClient>
				<App />
			</XRPLClient>
		);
	}

You can now start using the various hooks and components present in the library!  General purpose hooks, such as useIsConnected may be used within the scope of XRPLClient.  However, any request hooks require an Account component to be present and any transaction hooks require a Wallet component to be present.  

Here is a simple example using Account:

	import { Account } from '@nice-xrpl/react-xrpl'

	function App() {
		const myAddress = 'test address';

		return (
			<Account address={myAddress}>
				<ShowBalance />
			</Account>
		);
	}

	function ShowBalance() {
		const balance = useBalance();

		return (
			<div>Balance: {balance}</div>
		);
	}

Wallet accepts a seed or secret, or will generate a new seed from entropy.  Wallets provide credentials and are the only way to use transaction hooks (such as sending xrp).  On testnet, the useFundWallet hook may be used to seed xpr from a faucet.  A Wallet includes an Account component, so it is not neccessary to use it again.

	import { Wallet } from '@nice-xrpl/react-xrpl'

	function App() {
		const mySeed = 'test seed';

		return (
			<Wallet address={mySeed}>
				<SendXRP />
			</Wallet>
		);
	}

	function SendXRP() {
		const sendXRP = useSendXRP();
		const balance = useBalance();

		return (
			<div><button onClick={async () => {
				const result = await sendXRP('destination address', 48);
			}}>Send XRP</button></div>
			<div>My Balance: {balance}</div>
		);
	}


# License
ISC License

Copyright (c) 2012-2021 Contributers to xrpl.js

Permission to use, copy, modify, and distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.