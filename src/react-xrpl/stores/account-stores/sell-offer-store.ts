import { getSellOffers } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Amount, Client as xrplClient } from 'xrpl';
import { Offer, OfferStore } from '../../api/wallet-types';

/**
 * Manages the sell offer store for a given address and token ID.
 */
export class SellOfferStoreManager extends StoreManager<OfferStore> {
    private networkEmitter: NetworkEmitter;
    private onCreateSellOffer:
        | ((index: string, tokenId: string, amount: Amount) => void)
        | null;
    private onAcceptSellOffer:
        | ((index: string, tokenId: string) => void)
        | null;
    private client: xrplClient;
    private events = false;

    /**
     * Creates a new SellOfferStoreManager instance.
     *
     * @param client The XRPL client to use for requests.
     * @param networkEmitter The network emitter to use for event handling.
     */
    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super({});

        this.networkEmitter = networkEmitter;
        this.onCreateSellOffer = null;
        this.onAcceptSellOffer = null;
        this.client = client;
    }

    /**
     * Sets the initial sell offers for a given address and token ID.
     *
     * @param address The address for which to set the initial sell offers.
     * @param tokenId The ID of the token for which to set the initial sell offers.
     * @return A Promise that resolves to the OfferStore object containing the initial sell offers.
     */
    public async setInitialSellOffers(
        address: string,
        tokenId: string
    ): Promise<OfferStore> {
        const [store] = this.getStore(address);
        const sellOffers = await getSellOffers(this.client, tokenId).catch(
            (error) => {
                // TODO: silently ignore if not found error as this can indicate no offers exist
                console.log('error in getSellOffers: ', error);

                return [] as Offer[];
            }
        );
        console.log('initial sell offers store: ', tokenId, [...sellOffers]);

        store.setState((state) => {
            return {
                ...state,
                [tokenId]: sellOffers,
            };
        });

        return { [tokenId]: sellOffers };
    }

    /**
     * Enables events for a specific address by adding a listener and setting up the necessary event handling.
     *
     * @param address The address for which to enable events.
     */
    public enableEvents(address: string) {
        if (this.events) {
            return;
        }

        console.log('added listener for ', address);

        this.onCreateSellOffer = (
            index: string,
            tokenId: string,
            amount: Amount
        ) => {
            getSellOffers(this.client, tokenId)
                .then((sellOffers) => {
                    if (this.hasStore(address)) {
                        const [store] = this.getStore(address);
                        store.setState((state) => {
                            console.log(
                                'updating sell offers store: ',
                                { ...state },
                                [...sellOffers]
                            );
                            return {
                                ...state,
                                [tokenId]: sellOffers,
                            };
                        });
                    }
                })
                .catch((err) => {});
        };

        this.networkEmitter.on(
            address,
            WalletEvents.CreateSellOffer,
            this.onCreateSellOffer
        );

        this.onAcceptSellOffer = (index: string, tokenId: string) => {
            console.log('accept offer triggered: ', index, tokenId);
            this.onCreateSellOffer?.(index, tokenId, '0');
        };

        this.networkEmitter.on(
            address,
            WalletEvents.AcceptSellOffer,
            this.onAcceptSellOffer
        );

        this.events = true;
    }

    /**
     * Disables events for a specific address by removing the listener and necessary event handling.
     *
     * @param address The address for which to disable events.
     */
    public disableEvents(address: string) {
        if (!this.events) {
            return;
        }

        if (
            this.onCreateSellOffer === null ||
            this.onAcceptSellOffer === null
        ) {
            return;
        }

        console.log('removed listener for ', address);

        this.networkEmitter.off(
            address,
            WalletEvents.CreateSellOffer,
            this.onCreateSellOffer
        );

        this.networkEmitter.off(
            address,
            WalletEvents.AcceptSellOffer,
            this.onAcceptSellOffer
        );

        this.events = false;
    }
}
