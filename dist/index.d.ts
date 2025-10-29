import { AccountSet } from 'xrpl';
import { Amount } from 'xrpl';
import { default as default_2 } from 'react';
import { IssuedCurrencyAmount } from 'xrpl';
import { JSX } from 'react/jsx-runtime';
import { TxResponse } from 'xrpl';
import { Client as xrplClient } from 'xrpl';
import { Wallet as xrplWallet } from 'xrpl';

/**
 * Accepts a brokered offer by submitting an NFTokenAcceptOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenBuyOfferId - The ID of the buy offer.
 * @param {string} tokenSellOfferId - The ID of the sell offer.
 * @param {string} fee - The fee amount for the broker.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export declare function acceptBrokeredOffer(client: xrplClient, wallet: xrplWallet, tokenBuyOfferId: string, tokenSellOfferId: string, fee: string): Promise<TxResponse<    {
TransactionType: "NFTokenAcceptOffer";
Account: string;
NFTokenBuyOffer: string;
NFTokenSellOffer: string;
NFTokenBrokerFee: string;
}>>;

/**
 * Accepts a buy offer by submitting an NFTokenAcceptOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenOfferId - The ID of the buy offer.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export declare function acceptBuyOffer(client: xrplClient, wallet: xrplWallet, tokenOfferId: string): Promise<TxResponse<    {
TransactionType: "NFTokenAcceptOffer";
Account: string;
NFTokenBuyOffer: string;
}>>;

/**
 * Accepts a sell offer by submitting an NFTokenAcceptOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenOfferId - The ID of the sell offer.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export declare function acceptSellOffer(client: xrplClient, wallet: xrplWallet, tokenOfferId: string): Promise<TxResponse<    {
TransactionType: "NFTokenAcceptOffer";
Account: string;
NFTokenSellOffer: string;
}>>;

/**
 * A React component that manages the account address based on context or provided address.
 *
 * @param {string} address - The address of the account.
 * @param {React.ReactElement} fallback - The fallback element to render.
 * @param {React.ReactNode} children - The child components.
 * @return {JSX.Element} The JSX element representing the account.
 */
export declare function Account({ address, fallback, children }: AccountProps): JSX.Element;

declare type AccountProps = {
    address?: string;
    fallback?: default_2.ReactElement;
    children?: default_2.ReactNode;
};

/**
 * Sets or clears the default ripple flag for a given XRPL wallet.
 *
 * @param {xrplClient} client - The XRPL client to use for connecting to the network.
 * @param {xrplWallet} wallet - The XRPL wallet to modify.
 * @param {boolean} rippling - Whether to set or clear the default ripple flag.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export declare function allowRippling(client: xrplClient, wallet: xrplWallet, rippling: boolean): Promise<TxResponse<AccountSet>>;

declare class BalanceStore {
    private _store;
    private _client;
    private _address;
    constructor(client: xrplClient, address: string);
    getStore(): Store<string>;
    setInitialBalance(): Promise<string>;
    onBalanceChange(drops: string, xrp: number): void;
}

/**
 * Burns a non-fungible token by submitting an NFTokenBurn transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenID - The ID of the token to be burned.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export declare function burnToken(client: xrplClient, wallet: xrplWallet, tokenID?: string): Promise<TxResponse<    {
TransactionType: "NFTokenBurn";
Account: string;
NFTokenID: string;
}>>;

declare class BuyOfferStore {
    private _store;
    private _client;
    private _address;
    constructor(client: xrplClient, address: string);
    getStore(): Store<OfferStore>;
    setInitialBuyOffers(tokenId: string): Promise<{
        [tokenId]: Offer[];
    }>;
    onCreateBuyOffer(index: string, tokenId: string, amount: Amount): void;
    onAcceptBuyOffer(index: string, tokenId: string): void;
}

/**
 * Cancels an offer by submitting an NFTokenCancelOffer transaction to the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - The wallet used to sign and submit the transaction.
 * @param {string} tokenOfferId - The ID of the offer to be cancelled.
 * @return {Promise<any>} A promise that resolves with the result of the transaction submission.
 */
export declare function cancelOffer(client: xrplClient, wallet: xrplWallet, tokenOfferId: string): Promise<TxResponse<    {
TransactionType: "NFTokenCancelOffer";
Account: string;
NFTokenOffers: string[];
}>>;

declare type ClientStores = {
    connected: Store<boolean>;
};

/**
 * Converts a Ripple epoch time to a UTC date.
 *
 * @param {number} rippleEpoch - The Ripple epoch time to convert.
 * @return {Date} The UTC date corresponding to the Ripple epoch time.
 */
export declare function convertRippleEpochToUTCDate(rippleEpoch: number): Date;

/**
 * Creates and funds a wallet.
 *
 * @param {xrplClient} client - The XRPL client used to connect.
 * @param {string} [amount='1000'] - The amount to fund the wallet with.
 * @return {Promise<xrplWallet>} The funded wallet.
 */
export declare function createAndFundWallet(client: xrplClient, amount?: string): Promise<xrplWallet>;

/**
 * Creates a buy offer on the XRP Ledger network.
 *
 * @param {xrplClient} client - the XRPL client used to connect to the network.
 * @param {xrplWallet} wallet - the wallet used to sign and submit the transaction.
 * @param {string} owner - the address of the owner of the token.
 * @param {string} tokenId - the ID of the token.
 * @param {string} amount - the amount of the token to be bought.
 * @param {Object} options - additional options for the buy offer.
 * @param {Date} options.expiration - the expiration date of the buy offer.
 * @param {number} options.flags - the flags for the buy offer.
 * @param {string} options.destination - the destination address for the bought tokens.
 * @return {Promise<any>} a promise that resolves with the result of the transaction submission.
 */
export declare function createBuyOffer(client: xrplClient, wallet: xrplWallet, owner: string, tokenId: string, amount: string, { expiration, flags, destination, }: {
    expiration?: Date;
    flags?: number;
    destination?: string;
}): Promise<TxResponse<    {
TransactionType: "NFTokenCreateOffer";
Account: string;
NFTokenID: string;
Flags: number | undefined;
Amount: string;
Expiration: number | undefined;
Destination: string | undefined;
Owner: string;
}>>;

/**
 * Creates a sell offer on the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client instance.
 * @param {xrplWallet} wallet - The XRPL wallet instance.
 * @param {string} tokenId - The ID of the token being sold.
 * @param {string} amount - The amount of the token being sold.
 * @param {Object} options - Additional options for the sell offer.
 * @param {Date} [options.expiration] - The expiration date of the sell offer.
 * @param {number} [options.flags=1] - Additional flags for the sell offer.
 * @param {string} [options.destination] - The destination address for the sell offer.
 * @return {Promise<TxResponse>} A promise that resolves to the transaction response.
 */
export declare function createSellOffer(client: xrplClient, wallet: xrplWallet, tokenId: string, amount: string, { expiration, flags, destination, }: {
    expiration?: Date;
    flags?: number;
    destination?: string;
}): Promise<TxResponse<    {
TransactionType: "NFTokenCreateOffer";
Account: string;
NFTokenID: string;
Flags: number;
Amount: string;
Expiration: number | undefined;
Destination: string | undefined;
}>>;

/**
 * Creates a trustline between two wallets.
 *
 * @param {xrplClient} client - The XRPL client instance.
 * @param {xrplWallet} wallet - The wallet that is creating the trustline.
 * @param {string} targetAddress - The address of the wallet that is receiving the trustline.
 * @param {string} currencyCode - The currency code of the trustline.
 * @param {string} limit - The limit of the trustline.
 * @return {Promise<TxResponse>} A promise that resolves with the transaction response.
 * @throws {Promise<string>} If the target address is invalid or if the source and target addresses are the same.
 */
export declare function createTrustline(client: xrplClient, wallet: xrplWallet, targetAddress: string, currencyCode: string, limit: string): Promise<TxResponse<    {
TransactionType: "TrustSet";
Account: string;
LimitAmount: {
currency: string;
issuer: string;
value: string;
};
}>>;

/**
 * Creates a new wallet based on the provided seed. If no seed is provided, a new wallet is generated.
 *
 * @param {string} [seed] - The seed used to create the wallet. Optional.
 * @return {Wallet} The created wallet.
 */
export declare function createWallet(seed?: string): xrplWallet;

export declare type Currency = {
    issuer: string;
    value: number;
    currency: string;
};

declare class CurrencyStore {
    private _store;
    private _client;
    private _address;
    constructor(client: xrplClient, address: string);
    getStore(): Store<Currency[]>;
    setInitialBalance(): Promise<Currency[]>;
    onCurrencyChange(): void;
}

declare type EventMap = {
    [WalletEvents.BalanceChange]: (balance: string, xrp: number, hash: string) => void;
    [WalletEvents.PaymentSent]: (to: string, xrp: string, timestamp: number, hash: string) => void;
    [WalletEvents.PaymentRecieved]: (from: string, xrp: string, timestamp: number, hash: string) => void;
    [WalletEvents.CurrencyChange]: () => void;
    [WalletEvents.CurrencySent]: (to: string, amount: IssuedCurrencyAmount, timestamp: number, hash: string) => void;
    [WalletEvents.CurrencyRecieved]: (from: string, amount: IssuedCurrencyAmount, timestamp: number, hash: string) => void;
    [WalletEvents.TokenMint]: (token: string, timestamp: number, hash: string) => void;
    [WalletEvents.TokenBurn]: (token: string, timestamp: number, hash: string) => void;
    [WalletEvents.CreateBuyOffer]: (ledgerIndex: string, token: string, amount: Amount, timestamp: number, hash: string) => void;
    [WalletEvents.CreateSellOffer]: (ledgerIndex: string, token: string, amount: Amount, timestamp: number, hash: string) => void;
    [WalletEvents.CancelBuyOffer]: (hash: string) => void;
    [WalletEvents.CancelSellOffer]: (hash: string) => void;
    [WalletEvents.AcceptBuyOffer]: (buyOfferId: string, token: string, timestamp: number, hash: string) => void;
    [WalletEvents.AcceptSellOffer]: (sellOfferId: string, token: string, timestamp: number, hash: string) => void;
    [WalletEvents.TransferToken]: (hash: string) => void;
    [WalletEvents.RefreshTokens]: (hash: string) => void;
};

declare type Fn<T> = (prevState: T) => T;

/**
 * Retrieves the balances of a given address from the XRP Ledger using the provided client.
 *
 * @param {xrplClient} client - The client used to connect to the XRP Ledger.
 * @param {string} address - The address to retrieve balances for.
 * @return {Promise<[string, Currency[]]>} A promise that resolves to an array containing the initial balance and an array of Currency objects representing the balances of the address.
 */
export declare function getBalances(client: xrplClient, address: string): Promise<[string, Currency[]]>;

/**
 * Retrieves buy offers for a specific token from the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {string} tokenId - The ID of the token for which buy offers are requested.
 * @return {Offer[]} An array of Offer objects representing the buy offers for the specified token.
 */
export declare function getBuyOffers(client: xrplClient, tokenId: string): Promise<Offer[]>;

/**
 * Retrieves the initial state of a wallet including balance, currencies, tokens, buy offers, and sell offers.
 *
 * @param {xrplClient} client - The XRPL client used to retrieve the wallet state.
 * @param {string} address - The address of the wallet.
 * @return {Promise<WalletInitialState>} The initial state of the wallet including balance, currencies, tokens, buy offers, and sell offers.
 */
export declare function getInitialWalletState(client: xrplClient, address: string): Promise<WalletInitialState>;

/**
 * Retrieves the sell offers for a specific token from the XRPL network.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the network.
 * @param {string} tokenId - The ID of the token for which sell offers are requested.
 * @return {Promise<Offer[]>} A promise that resolves to an array of Offer objects representing the sell offers for the specified token.
 */
export declare function getSellOffers(client: xrplClient, tokenId: string): Promise<Offer[]>;

/**
 * Retrieves a list of tokens associated with a given address.
 *
 * @param {xrplClient} client - The XRPL client used to connect to the XRPL network.
 * @param {string} address - The address for which to retrieve the tokens.
 * @return {Promise<Token[]>} A promise that resolves to an array of tokens.
 */
export declare function getTokens(client: xrplClient, address: string): Promise<Token[]>;

/**
 * Retrieves the XRP balance of a given address using the provided XRP client.
 *
 * @param {xrplClient} client - The XRP client used to connect to the XRP network.
 * @param {string} address - The address for which to retrieve the XRP balance.
 * @return {Promise<string>} - A promise that resolves to the XRP balance as a string.
 * @throws {Error} - If there is an error connecting to the XRP network or retrieving the balance.
 */
export declare function getXRPBalance(client: xrplClient, address: string): Promise<number>;

/**
 * Function to mint a non-fungible token (NFT).
 *
 * @param {xrplClient} client - The XRPL client to use for the transaction.
 * @param {xrplWallet} wallet - The XRPL wallet to mint the NFT from.
 * @param {string} url - The URL associated with the NFT (optional, defaults to an empty string).
 * @param {number} transferFee - The transfer fee for the transaction (optional, defaults to 0).
 * @param {number} flags - The flags for the transaction (optional, defaults to 8).
 * @param {number} taxon - The taxon for the NFT (optional, defaults to 0).
 * @return {Promise} A promise that resolves with the result of the minting transaction.
 */
export declare function mintToken(client: xrplClient, wallet: xrplWallet, url?: string, transferFee?: number, flags?: number, taxon?: number): Promise<TxResponse<    {
TransactionType: "NFTokenMint";
Account: string;
URI: string;
Flags: number;
TransferFee: number;
NFTokenTaxon: number;
}>>;

declare class NetworkEmitter {
    private _client;
    private _eventsEnabled;
    private _addressEvents;
    constructor(client: xrplClient);
    start(): void;
    stop(): void;
    private getEvents;
    enableEventsForAddress(address: string): Promise<void>;
    disableEventsForAddress(address: string): Promise<void>;
    hasEventsForAddress(address: string): boolean;
    getBalanceStore(address: string): BalanceStore;
    getCurrencyStore(address: string): CurrencyStore;
    getTokenStore(address: string): TokenStore;
    getBuyOfferStore(address: string): BuyOfferStore;
    getSellOfferStore(address: string): SellOfferStore;
    on<T extends WalletEvent>(address: string, event: T, callback: EventMap[T]): () => void;
    off<T extends WalletEvent>(address: string, event: T, callback: EventMap[T]): void;
    private onTransaction;
}

export declare const Networks: {
    readonly Testnet: "wss://s.altnet.rippletest.net:51233";
    readonly Devnet: "wss://s.devnet.rippletest.net:51233";
};

export declare type Offer = {
    index: string;
    amount: string;
    owner: string;
    expiration?: number;
    destination?: string;
};

export declare type OfferStore = {
    [key in string]?: Offer[];
};

export declare const ReserveRequirement = 10;

declare class SellOfferStore {
    private _store;
    private _client;
    private _address;
    constructor(client: xrplClient, address: string);
    getStore(): Store<OfferStore>;
    setInitialSellOffers(tokenId: string): Promise<{
        [tokenId]: Offer[];
    }>;
    onCreateSellOffer(index: string, tokenId: string, amount: Amount): void;
    onAcceptSellOffer(index: string, tokenId: string): void;
}

/**
 * Sends a payment transaction to a destination address with the specified currency and amount.
 *
 * @deprecated Use sendCurrencyAmount instead!
 * @param {xrplClient} client - The XRPL client used to send the transaction.
 * @param {xrplWallet} wallet - The wallet initiating the transaction.
 * @param {string} destinationAddress - The destination address for the payment.
 * @param {string} currencyCode - The currency code of the payment.
 * @param {string} amount - The amount of currency to be sent.
 * @return {Promise} A Promise that resolves with the result of the transaction submission.
 */
export declare function sendCurrency(client: xrplClient, wallet: xrplWallet, destinationAddress: string, currencyCode: string, amount: string): Promise<void>;

/**
 * Sends a currency amount from one wallet to a destination address.
 *
 * @param {xrplClient} client - The XRPL client used to send the transaction.
 * @param {xrplWallet} wallet - The wallet initiating the transaction.
 * @param {string} destinationAddress - The destination address for the payment.
 * @param {Amount} amount - The amount of currency to be sent.
 * @return {Promise} A Promise that resolves with the result of the transaction submission.
 */
export declare function sendCurrencyAmount(client: xrplClient, wallet: xrplWallet, destinationAddress: string, amount: IssuedCurrencyAmount): Promise<TxResponse<    {
TransactionType: "Payment";
Account: string;
Amount: IssuedCurrencyAmount;
Destination: string;
}>>;

/**
 * Sends XRP from one wallet to a destination address.
 *
 * @param {xrplClient} client - The XRPL client used to send the transaction.
 * @param {xrplWallet} wallet - The wallet initiating the transaction.
 * @param {string} destinationAddress - The destination address for the payment.
 * @param {number} amount - The amount of XRP to be sent.
 * @return {Promise<TxResponse>} A Promise that resolves with the result of the transaction submission.
 * @throws {string} 'Invalid destination address' if the destination address is invalid.
 * @throws {string} 'Source and destination addresses are the same' if the source and destination addresses are the same.
 */
export declare function sendXRP(client: xrplClient, wallet: xrplWallet, destinationAddress: string, amount: number): Promise<TxResponse<    {
TransactionType: "Payment";
Account: string;
Amount: string;
Destination: string;
}>>;

declare type Store<T = unknown> = {
    getState: () => T;
    setState: (value: T | Fn<T>) => void;
    subscribe: (listener: StoreListener) => () => void;
};

declare type StoreListener = () => void;

export declare type Token = {
    flags: number;
    issuer: string;
    id: string;
    taxon: number;
    uri: string;
};

declare class TokenStore {
    private _store;
    private _client;
    private _address;
    constructor(client: xrplClient, address: string);
    getStore(): Store<Token[]>;
    setInitialTokens(): Promise<Token[]>;
    onTokenMint(token: string, timestamp: number): void;
    onTokenBurn(token: string, timestamp: number): void;
    onAcceptBuyOffer(index: string, tokenId: string): void;
    onAcceptSellOffer(index: string, tokenId: string): void;
}

export declare type TransactionLogEntry = {
    type: 'PaymentSent';
    to: string;
    account: string;
    timestamp: number;
    payload: {
        amount: string;
    };
    hash: string;
} | {
    type: 'PaymentReceived';
    from: string;
    account: string;
    timestamp: number;
    payload: {
        amount: string;
    };
    hash: string;
} | {
    type: 'CurrencySent';
    to: string;
    account: string;
    timestamp: number;
    payload: {
        amount: IssuedCurrencyAmount;
    };
    hash: string;
} | {
    type: 'CurrencyReceived';
    from: string;
    account: string;
    timestamp: number;
    payload: {
        amount: IssuedCurrencyAmount;
    };
    hash: string;
} | {
    type: 'CreateSellOffer';
    timestamp: number;
    payload: {
        token: string;
        offerId: string;
    };
    hash: string;
} | {
    type: 'AcceptSellOffer';
    timestamp: number;
    payload: {
        token: string;
        offerId: string;
    };
    hash: string;
} | {
    type: 'TokenMint';
    timestamp: number;
    payload: {
        token: string;
    };
    hash: string;
} | {
    type: 'TokenBurn';
    timestamp: number;
    payload: {
        token: string;
    };
    hash: string;
};

export declare type TransactionType = TransactionLogEntry['type'];

/**
 * Creates a custom hook that accepts a brokered offer by submitting a transaction to the XRPL network.
 *
 * @return {Function} A function that accepts the following parameters:
 *   - tokenBuyOfferId: The ID of the buy offer.
 *   - tokenSellOfferId: The ID of the sell offer.
 *   - fee: The fee amount for the broker.
 */
export declare function useAcceptBrokeredOffer(): (tokenBuyOfferId: string, tokenSellOfferId: string, fee: string) => Promise<TxResponse>;

/**
 * Generates a function comment for the given function body.
 *
 * @return {Function} A function that accepts a token offer ID and returns a promise of TxResponse.
 */
export declare function useAcceptBuyOffer(): (tokenOfferId: string) => Promise<TxResponse>;

/**
 * Generates a function comment for the given function body.
 *
 * @return {Function} A function that accepts a token offer ID and returns a promise of TxResponse.
 */
export declare function useAcceptSellOffer(): (tokenOfferId: string) => Promise<TxResponse>;

export declare function useAllowRippling(): Promise<(allow: boolean) => Promise<TxResponse<AccountSet>>>;

/**
 * A custom hook that retrieves the balance of a given address using the WalletStoreManager.
 *
 * @param {string} address - The optional address to retrieve the balance for. If not provided, the balance of the currently selected address will be returned.
 * @return {Promise<string>} - A promise that resolves to the balance of the address as a string.
 */
export declare function useBalance(address?: string): string;

/**
 * Creates a custom hook that burns a non-fungible token by submitting an NFTokenBurn transaction to the XRPL network.
 *
 * @return {Function} A function that accepts a token ID and returns a promise of TxResponse.
 */
export declare function useBurnToken(): (tokenID: string) => Promise<TxResponse>;

/**
 * Custom hook that returns the buy offers for a given token ID.
 *
 * @param {string} tokenId - The ID of the token.
 * @param {string} [address] - The optional address to filter the buy offers by.
 * @return {Offer[] | undefined} The buy offers for the given token ID, or undefined if not found.
 */
export declare function useBuyOffers(tokenId: string, address?: string): Offer[] | undefined;

/**
 * Creates a custom hook that cancels a token offer by submitting an NFTokenCancelOffer transaction to the XRPL network.
 *
 * @return {Function} A function that accepts a token offer ID and returns a promise of TxResponse.
 */
export declare function useCancelOffer(): (tokenOfferId: string) => Promise<TxResponse>;

/**
 * Custom hook that retrieves the client stores from the ClientStoreContext.
 *
 * @return {Object} The client stores object containing various store managers.
 */
export declare function useClientStores(): ClientStores;

/**
 * A custom hook for creating and funding a wallet.
 *
 * @param {string} amount - The amount to fund the wallet with.
 * @return {Promise<Wallet>} The funded wallet.
 */
export declare function useCreateAndFundWallet(): (amount: string) => Promise<xrplWallet>;

/**
 * Creates a custom hook for creating a buy offer on the XRP Ledger network.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - owner: The address of the owner of the token.
 *   - tokenId: The ID of the token.
 *   - amount: The amount of the token to be bought.
 *   - options: An optional object containing additional options for the buy offer.
 *     - expiration: The expiration date of the buy offer.
 *     - destination: The destination address for the bought tokens.
 * @return {Promise<TxResponse>} A promise that resolves with the result of the transaction submission.
 */
export declare function useCreateBuyOffer(): (owner: string, tokenId: string, amount: string, { expiration, destination, }?: {
    expiration?: Date | undefined;
    destination?: string | undefined;
}) => Promise<TxResponse>;

/**
 * Creates a custom hook for creating a sell offer on the XRP Ledger network.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - tokenId: The ID of the token being sold.
 *   - amount: The amount of the token being sold.
 *   - options: An optional object containing additional options for the sell offer.
 *     - expiration: The expiration date of the sell offer.
 *     - flags: Additional flags for the sell offer.
 *     - destination: The destination address for the sell offer.
 * @return {Promise<TxResponse>} A promise that resolves to the transaction response.
 */
export declare function useCreateSellOffer(): (tokenId: string, amount: string, { expiration, destination, flags, }: {
    expiration?: Date | undefined;
    flags?: number | undefined;
    destination?: string | undefined;
}) => Promise<TxResponse>;

/**
 * Returns a function that can be used to create a trustline.
 *
 * @return {Function} A function that creates a trustline.
 */
export declare function useCreateTrustline(): (targetWalletAddress: string, currencyCode: string, limit: string) => Promise<TxResponse>;

/**
 * Returns a function that creates a new wallet using the provided seed.
 *
 * @return {Function} A function that takes an optional seed string and returns a Wallet object.
 */
export declare function useCreateWallet(): (seed?: string) => xrplWallet;

/**
 * Retrieves the currency balance for a given address using the WalletStoreManager.
 *
 * @param {string} [address] - The optional address to retrieve the currency balance for. If not provided, the balance of the currently selected address will be returned.
 * @return {Currency[]} - An array of Currency objects representing the currency balance of the address.
 */
export declare function useCurrencyBalance(address?: string): Currency[];

/**
 * Returns a function that can be used to fund a wallet with a specified amount.
 *
 * @return {Function} A function that takes an amount as a string and returns a Promise that resolves to an object with the funded wallet and its balance.
 */
export declare function useFundWallet(): (amount: string) => Promise<{
    wallet: xrplWallet;
    balance: number;
}>;

/**
 * Custom hook that retrieves buy offers for a given token ID from the XRPL network.
 *
 * @return {Function} A function that, when called with a token ID, retrieves the buy offers for that token and updates the buyOffers store.
 */
export declare function useGetBuyOffers(): (tokenId: string) => Promise<Offer[]>;

/**
 * Retrieves the sell offers for a given token from the XRPL network.
 *
 * @return {Function} A function that, when called with a token ID, retrieves the sell offers for that token and updates the sellOffers store.
 */
export declare function useGetSellOffers(): (tokenId: string) => Promise<Offer[]>;

/**
 * A hook that retrieves tokens associated with a given address.
 *
 * @return {function} A function that, when called, retrieves tokens.
 */
export declare function useGetTokens(): () => Promise<Token[]>;

/**
 * Custom hook that returns a function to get the XRP balance of a given address using the provided XRP client.
 *
 * @return {Function} A function that takes no arguments and returns a Promise that resolves to the XRP balance as a string.
 */
export declare function useGetXRPBalance(): () => Promise<number>;

/**
 * Returns the current connection status.
 *
 * @return {boolean} The connection status.
 */
export declare function useIsConnected(): boolean;

/**
 * Custom hook that provides a function to mint a token.
 *
 * @return {Function} A function that takes the following parameters:
 *   - url (string): The URL of the token to mint.
 *   - transferFee (number): The transfer fee for the token minting transaction. Defaults to 0.
 *   - options (Object): An optional object containing additional options:
 *     - flags (number): The flags for the mint transaction.
 *     - taxon (number): The taxon for the mint transaction.
 * @return {Promise<TxResponse>} A promise that resolves to the result of the mint transaction.
 */
export declare function useMintToken(): (url: string, transferFee?: number, { flags, taxon, }?: {
    flags?: number;
    taxon?: number;
}) => Promise<TxResponse>;

/**
 * Retrieves the network emitter from the network emitter context.
 *
 * @return {NetworkEmitter} The network emitter instance.
 * @throws {Error} If the network emitter context is not found.
 */
export declare function useNetworkEmitter(): NetworkEmitter;

/**
 * A custom hook that retrieves sell offers for a given token from the XRPL network.
 *
 * @param {string} tokenId - The ID of the token for which to retrieve sell offers.
 * @param {string} [address] - (Optional) The address for which to retrieve sell offers. If not provided, the default address from the wallet store manager will be used.
 * @return {Offer[] | undefined} An array of sell offers for the given token, or undefined if the offers have not been fetched yet.
 */
export declare function useSellOffers(tokenId: string, address?: string): Offer[] | undefined;

/**
 * Creates a custom hook for sending currency to a destination address.
 *
 * @deprecated Use useSendCurrencyAmount instead!
 * @return {Function} The custom hook that takes the following parameters:
 *   - destinationAddress: The address to send the currency to.
 *   - currencyCode: The code of the currency to be sent.
 *   - amount: The amount of currency to be sent. It can be a string or an Amount object.
 * @return {Promise<TxResponse>} A promise that resolves with the result of the transaction submission.
 */
export declare function useSendCurrency(): void;

export declare function useSendCurrencyAmount(): (destinationAddress: string, amount: IssuedCurrencyAmount) => Promise<TxResponse>;

/**
 * Generates a custom hook for sending XRP to a destination address.
 *
 * @return {Function} The custom hook that takes the following parameters:
 *   - destinationAddress: The address to send the XRP to.
 *   - amount: The amount of XRP to be sent.
 * @return {Promise<TxResponse>} A promise that resolves with the result of the transaction submission.
 */
export declare function useSendXRP(): (destinationAddress: string, amount: number) => Promise<TxResponse>;

/**
 * Retrieves the tokens associated with a given address using the WalletStoreManager.
 *
 * @param {string} [address] - The optional address to retrieve the tokens for. If not provided, the tokens of the currently selected address will be returned.
 * @return {Promise<Token[]>} - A promise that resolves to an array of tokens associated with the address.
 */
export declare function useTokens(address?: string): Token[];

/**
 * Retrieves the transaction log for the specified accounts and updates the state with the new log entries.
 *
 * @param {string | string[]} [account] - The account(s) to retrieve the transaction log for.
 * @param {number} [limit] - The maximum number of log entries to retrieve.
 * @return {TransactionLogEntry[]} The transaction log for the specified accounts.
 */
export declare function useTransactionLog(account?: string | string[], limit?: number): TransactionLogEntry[];

/**
 * A hook that returns the xrplWallet object from the WalletContext.
 *
 * @return {xrplWallet} The xrplWallet object from the WalletContext.
 */
export declare function useWallet(): xrplWallet;

/**
 * A hook that returns the wallet address.
 *
 * @return {string} The wallet address.
 */
export declare function useWalletAddress(): string;

/**
 * Retrieves the XRPL client from the XRPLClientContext.
 *
 * @return {xrplClient} The XRPL client instance.
 */
export declare function useXRPLClient(): xrplClient;

/**
 * Generates a wallet based on the provided seed. If no seed is provided, a new wallet is generated.
 *
 * @param {WalletProps} seed - The seed used to generate the wallet. Optional.
 * @param {React.ReactElement} fallback - The fallback element to render if no wallet is generated. Default is an empty fragment.
 * @param {React.ReactNode} children - The child elements to render within the wallet context.
 * @return {React.ReactNode} The rendered wallet context or the fallback element.
 */
export declare function Wallet({ seed, fallback, children }: WalletProps): JSX.Element;

declare type WalletEvent = keyof EventMap;

declare const WalletEvents: {
    readonly BalanceChange: "balance-change";
    readonly PaymentSent: "payment-sent";
    readonly PaymentRecieved: "payment-recieved";
    readonly CurrencyChange: "currency-change";
    readonly CurrencySent: "currency-sent";
    readonly CurrencyRecieved: "currency-recieved";
    readonly TokenMint: "token-mint";
    readonly TokenBurn: "token-burn";
    readonly CreateBuyOffer: "create-buy-offer";
    readonly CreateSellOffer: "create-sell-offer";
    readonly CancelBuyOffer: "cancel-buy-offer";
    readonly CancelSellOffer: "cancel-sell-offer";
    readonly AcceptBuyOffer: "accept-buy-offer";
    readonly AcceptSellOffer: "accept-sell-offer";
    readonly TransferToken: "transfer-token";
    readonly RefreshTokens: "refresh-tokens";
};

export declare type WalletInitialState = {
    balance: string;
    currencies: Currency[];
    tokens: Token[];
    sellOffers: OfferStore;
    buyOffers: OfferStore;
};

declare type WalletProps = {
    seed?: string;
    fallback?: default_2.ReactElement;
    children?: default_2.ReactNode;
};

/**
 * Creates an XRPL client with the specified network and provides it to its children components.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be wrapped by the XRPL client.
 * @param {string} [props.network=Networks.Testnet] - The network to connect to. Defaults to Networks.Testnet.
 * @return {JSX.Element} The XRPL client component.
 */
export declare function XRPLClient({ children, network, }: {
    children: React.ReactNode;
    network?: string;
}): JSX.Element;

export { xrplClient }

export { xrplWallet }

export { }
