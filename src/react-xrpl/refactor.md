Wallet represents something with a public and private key that can sign transactions

An address is just that, an address that is used for requests - an Account is almost looking at the address.

A wallet implies the ability to make transactions

So using the <Wallet> component should come with <Credentials>

export function createWalletStore() {
    return {
        balance: createStore<number>(0),
        tokens: createStore<Token[]>([]),
        currencies: createStore<Currency[]>([]),
        buyOffers: createStore<OfferStore>({}),
        sellOffers: createStore<OfferStore>({}),
		transactionLog: createStore<Transaction[]>([]),
    };
}

useTransactionLog()

<Credentials seed={}>
	<Wallet address={}>
	</Wallet>
</Credentials>


Wallet
- wraps an address to use for all queries

Credentials
- wraps a wallet, aka a public/private key combination that can be used to sign transactions



options: {
	account?: string
	accounts?: string[]
	events: WalletEvents[]
}

useTransactionLog(options) -> used within the scope of a wallet
useTransactionLog(account) -> can be used within the scope of XRPLClient, does not require a wallet
useTransactionLog([accounts]) -> same as above, but multiple accounts


1. move client transaction event emitter to xrpl client level
	- client.on('transaction', onTransaction) moves to xrpl client
2. wallet emitter uses internal events to trigger wallet
3. usetransactionlog hooks into these events to produce transaction log when the hook is used
	- walletEvents.on('payment')
	- walletEvents.on(')


<Wallet seed={}>
	<Account address={}>
	</Account>
</Wallet>

