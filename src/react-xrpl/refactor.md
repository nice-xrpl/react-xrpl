Wallet represents something with a public and private key that can sign transactions

An account is just an address.  queries can be made on accounts.
A wallet implies the ability to make transactions, in addition to queries

useTransactionLog()

<Wallet seed={}>
</Wallet>

<Account address={}>
</Account>

Wallet
- wraps an account to use for all queries
- contains the xrpl wallet with public/private keys for signing transactions

Account
- Sugar for using query hooks
- query hooks normally require an address, Account allows query hooks to be used without specifying an address

Global stores
- reactive stores for balances, currencies, etc. (query events that used to be at the Wallet level) are now stored globally by address
- when query hooks use them, they will create a new store and refcount to ensure only a single store is present per address
- query hooks will add their own listeners to wallet events to update the appropriate store they are using.

Query Hooks
- query hooks can now be used outside of an account
- useBalance(address) vs. useBalance()
- just depends on need
- These hooks now subscribe to the various wallet events and update their appropriate stores respectively

Wallet Events
- These are now global.  A singular event emitter exists at the client root for transactions
- as subscribers are added to events, the appropriate accounts are listened to for transactions
- as transactions come in, they are filtered by address with the appropriate listeners called


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



UPDATES

1. condense storemanager stores - don't really need to be in multiple files, too much boilerplate
2. refactor and move wallet emitter to client level
3. complete use-transaction-log to use wallet emitter events



network emitter
- xrpl client level - listens on transaction on xrpl client
- account
	- add address
	- starts events for this address, add refcount (client request sub)
	- starts emitting events
	- future calls to add address for same address increase refcount
	- remove address - remove ref count, unsub on 0 count

- network-events context - enable listeners at global level
- account-events context - enable account listeners to balance changes