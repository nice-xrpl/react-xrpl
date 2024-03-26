import { getSellOffers } from '../../api/requests/get-sell-offers';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { Store } from '../create-store';
import { StoreManager } from '../store-manager';
import { Amount, Client as xrplClient } from 'xrpl';
import { OfferStore } from '../../api/wallet-types';

export class SellOfferStoreManager {
    private sellOfferStore: StoreManager<OfferStore>;

    private networkEmitter: NetworkEmitter;
    private onCreateSellOffer:
        | ((index: string, tokenId: string, amount: Amount) => void)
        | null;
    private onAcceptOffer: ((index: string, tokenId: string) => void) | null;
    private client: xrplClient;

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        this.sellOfferStore = new StoreManager<OfferStore>({});
        this.networkEmitter = networkEmitter;
        this.onCreateSellOffer = null;
        this.onAcceptOffer = null;
        this.client = client;
    }

    public async getStore(
        address: string
    ): Promise<[Store<OfferStore>, () => void]> {
        console.log('getting store for ', address);
        const [offerStore, created] = this.sellOfferStore.getStore(address);

        if (created) {
            console.log('added listener for ', address);

            this.onCreateSellOffer = (
                index: string,
                tokenId: string,
                amount: Amount
            ) => {
                getSellOffers(this.client, tokenId)
                    .then((sellOffers) => {
                        offerStore.setState((state) => {
                            console.log(
                                'updating buy offers store: ',
                                { ...state },
                                [...sellOffers]
                            );
                            return {
                                ...state,
                                [tokenId]: sellOffers,
                            };
                        });
                    })
                    .catch((err) => {});
            };

            this.networkEmitter.on(
                address,
                WalletEvents.CreateSellOffer,
                this.onCreateSellOffer
            );

            this.onAcceptOffer = (index: string, tokenId: string) => {
                console.log('accept offer triggered: ', index, tokenId);

                this.onCreateSellOffer?.(index, tokenId, '0');
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
                const released = this.sellOfferStore.releaseStore(address);
                console.log('released store for ', address);

                if (released && this.onCreateSellOffer && this.onAcceptOffer) {
                    console.log('removed listener for ', address);

                    this.networkEmitter.off(
                        address,
                        WalletEvents.CreateSellOffer,
                        this.onCreateSellOffer
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
