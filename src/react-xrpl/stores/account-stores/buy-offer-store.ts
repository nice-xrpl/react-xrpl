import { getBuyOffers } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Amount, Client as xrplClient } from 'xrpl';
import { Offer, OfferStore } from '../../api/wallet-types';

/**
 * Manages the buy offer store for a given address.
 */
export class BuyOfferStoreManager extends StoreManager<OfferStore> {
    private networkEmitter: NetworkEmitter;
    private onCreateBuyOffer:
        | ((index: string, tokenId: string, amount: Amount) => void)
        | null;
    private onAcceptBuyOffer: ((index: string, tokenId: string) => void) | null;
    private client: xrplClient;
    private events = false;

    /**
     * Constructs a new instance of the BuyOfferStoreManager.
     *
     * @param client The XRPL Client to use for requests.
     * @param networkEmitter The network emitter to use for events.
     */
    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super({});

        this.networkEmitter = networkEmitter;
        this.onCreateBuyOffer = null;
        this.onAcceptBuyOffer = null;
        this.client = client;
    }

    /**
     * Sets the initial buy offers for a given address and token ID.
     *
     * @param address The address for which to set the initial buy offers.
     * @param tokenId The ID of the token for which to set the initial buy offers.
     * @return A Promise that resolves to the OfferStore object containing the initial buy offers.
     */
    public async setInitialBuyOffers(
        address: string,
        tokenId: string
    ): Promise<OfferStore> {
        const [store] = this.getStore(address);
        const buyOffers = await getBuyOffers(this.client, tokenId).catch(
            (error) => {
                // TODO: silently ignore if not found error as this can indicate no offers exist
                console.log('error in getBuyOffers: ', error);

                return [] as Offer[];
            }
        );
        console.log('initial buy offers store: ', tokenId, [...buyOffers]);

        store.setState((state) => {
            return {
                ...state,
                [tokenId]: buyOffers,
            };
        });

        return { [tokenId]: buyOffers };
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

        this.onCreateBuyOffer = (
            index: string,
            tokenId: string,
            amount: Amount
        ) => {
            getBuyOffers(this.client, tokenId)
                .then((buyOffers) => {
                    if (this.hasStore(address)) {
                        const [store] = this.getStore(address);
                        store.setState((state) => {
                            console.log(
                                'updating buy offers store: ',
                                { ...state },
                                [...buyOffers]
                            );
                            return {
                                ...state,
                                [tokenId]: buyOffers,
                            };
                        });
                    }
                })
                .catch((err) => {});
        };

        this.networkEmitter.on(
            address,
            WalletEvents.CreateBuyOffer,
            this.onCreateBuyOffer
        );

        this.onAcceptBuyOffer = (index: string, tokenId: string) => {
            console.log('accept offer triggered: ', index, tokenId);
            this.onCreateBuyOffer?.(index, tokenId, '0');
        };

        this.networkEmitter.on(
            address,
            WalletEvents.AcceptBuyOffer,
            this.onAcceptBuyOffer
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

        if (this.onCreateBuyOffer === null || this.onAcceptBuyOffer === null) {
            return;
        }

        console.log('removed listener for ', address);

        this.networkEmitter.off(
            address,
            WalletEvents.CreateBuyOffer,
            this.onCreateBuyOffer
        );

        this.networkEmitter.off(
            address,
            WalletEvents.AcceptBuyOffer,
            this.onAcceptBuyOffer
        );

        this.events = false;
    }
}
