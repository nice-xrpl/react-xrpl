import { getBuyOffers } from '../../api/requests/get-buy-offers';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { Store } from '../create-store';
import { StoreManager } from '../store-manager';
import { Amount, Client as xrplClient } from 'xrpl';
import { OfferStore } from '../../api/wallet-types';

export class BuyOfferStoreManager {
    private buyOffersStore: StoreManager<OfferStore>;

    private networkEmitter: NetworkEmitter;
    private onCreateBuyOffer:
        | ((index: string, tokenId: string, amount: Amount) => void)
        | null;
    private onAcceptOffer: ((index: string, tokenId: string) => void) | null;
    private client: xrplClient;

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        this.buyOffersStore = new StoreManager<OfferStore>({});
        this.networkEmitter = networkEmitter;
        this.onCreateBuyOffer = null;
        this.onAcceptOffer = null;
        this.client = client;
    }

    public async getStore(
        address: string
    ): Promise<[Store<OfferStore>, () => void]> {
        console.log('getting store for ', address);
        const [offerStore, created] = this.buyOffersStore.getStore(address);

        if (created) {
            console.log('added listener for ', address);

            this.onCreateBuyOffer = (
                index: string,
                tokenId: string,
                amount: Amount
            ) => {
                getBuyOffers(this.client, tokenId)
                    .then((buyOffers) => {
                        offerStore.setState((state) => {
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
                    })
                    .catch((err) => {});
            };

            this.networkEmitter.on(
                address,
                WalletEvents.CreateBuyOffer,
                this.onCreateBuyOffer
            );

            this.onAcceptOffer = (index: string, tokenId: string) => {
                console.log('accept offer triggered: ', index, tokenId);

                this.onCreateBuyOffer?.(index, tokenId, '0');
            };

            this.networkEmitter.on(
                address,
                WalletEvents.AcceptBuyOffer,
                this.onAcceptOffer
            );
        }

        return Promise.resolve([
            offerStore,
            () => {
                const released = this.buyOffersStore.releaseStore(address);
                console.log('released store for ', address);

                if (released && this.onCreateBuyOffer && this.onAcceptOffer) {
                    console.log('removed listener for ', address);

                    this.networkEmitter.off(
                        address,
                        WalletEvents.CreateBuyOffer,
                        this.onCreateBuyOffer
                    );

                    this.networkEmitter.off(
                        address,
                        WalletEvents.AcceptBuyOffer,
                        this.onAcceptOffer
                    );
                }
            },
        ]);
    }
}
