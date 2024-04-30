import { getTokens } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Client as xrplClient } from 'xrpl';
import { Token } from '../../api/wallet-types';

/**
 * Manages the token store for a given address.
 */
export class TokenStoreManager extends StoreManager<Token[]> {
    private networkEmitter: NetworkEmitter;
    private onTokenMint: ((token: string, timestamp: number) => void) | null;
    private onTokenBurn: ((token: string, timestamp: number) => void) | null;
    private onAcceptBuyOffer: ((index: string, tokenId: string) => void) | null;
    private onAcceptSellOffer:
        | ((index: string, tokenId: string) => void)
        | null;
    private client: xrplClient;
    private events = false;

    /**
     * Creates a new TokenStoreManager.
     * @param client An xrplClient.
     * @param networkEmitter A NetworkEmitter.
     */
    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super([]);

        console.log('constructing new token store...', networkEmitter);

        this.networkEmitter = networkEmitter;
        this.onTokenMint = null;
        this.onTokenBurn = null;
        this.onAcceptBuyOffer = null;
        this.onAcceptSellOffer = null;
        this.client = client;
    }

    /**
     * Sets the initial tokens for a given address.
     * @param address The address for which to set the initial tokens.
     * @return A Promise that resolves to the Token[] for the given address.
     */
    public async setInitialTokens(address: string): Promise<Token[]> {
        const [store] = this.getStore(address);
        const tokens = await getTokens(this.client, address).catch((error) => {
            console.log('error in getTokens: ', error);
            return [] as Token[];
        });
        console.log('get initial tokens: ', tokens);
        store.setState(tokens);

        return tokens;
    }

    /**
     * Enables events for a specific address by adding a listener and setting up the necessary event handling.
     * @param address The address for which to enable events.
     */
    public enableEvents(address: string) {
        if (this.events) {
            return;
        }

        console.log('added token listener for ', address);

        this.onTokenMint = this.onTokenBurn = (
            token: string,
            timestamp: number
        ) => {
            getTokens(this.client, address).then((tokens) => {
                if (this.hasStore(address)) {
                    const [store] = this.getStore(address);
                    store.setState(tokens);
                }
            });
        };

        this.networkEmitter.on(
            address,
            WalletEvents.TokenMint,
            this.onTokenMint
        );

        this.networkEmitter.on(
            address,
            WalletEvents.TokenBurn,
            this.onTokenBurn
        );

        this.onAcceptBuyOffer = this.onAcceptSellOffer = (
            index: string,
            tokenId: string
        ) => {
            getTokens(this.client, address).then((tokens) => {
                if (this.hasStore(address)) {
                    const [store] = this.getStore(address);
                    store.setState(tokens);
                }
            });
        };

        this.networkEmitter.on(
            address,
            WalletEvents.AcceptBuyOffer,
            this.onAcceptBuyOffer
        );

        this.networkEmitter.on(
            address,
            WalletEvents.AcceptSellOffer,
            this.onAcceptSellOffer
        );

        this.events = true;
    }

    /**
     * Disables events for a specific address by removing the listener and necessary event handling.
     * @param address The address for which to disable events.
     */
    public disableEvents(address: string) {
        if (!this.events) {
            return;
        }

        if (
            this.onTokenBurn === null ||
            this.onTokenMint === null ||
            this.onAcceptBuyOffer === null ||
            this.onAcceptSellOffer === null
        ) {
            return;
        }

        console.log('removed token listener for ', address);

        this.networkEmitter.off(
            address,
            WalletEvents.TokenMint,
            this.onTokenMint
        );

        this.networkEmitter.off(
            address,
            WalletEvents.TokenBurn,
            this.onTokenBurn
        );

        this.networkEmitter.off(
            address,
            WalletEvents.AcceptBuyOffer,
            this.onAcceptBuyOffer
        );

        this.networkEmitter.off(
            address,
            WalletEvents.AcceptSellOffer,
            this.onAcceptSellOffer
        );

        this.events = false;
    }
}
