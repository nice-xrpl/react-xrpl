import { getBalances } from '../../api/requests/get-balances';
import { getBuyOffers } from '../../api/requests/get-buy-offers';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { Store } from '../create-store';
import { StoreManager } from '../store-manager';
import { Amount, Client as xrplClient } from 'xrpl';
import { OfferStore, Token } from '../../api/wallet-types';

export class TokenStoreManager {
    private buyOffersStore: StoreManager<OfferStore>;
    private sellOffersStore: StoreManager<OfferStore>;
    private tokensStore: StoreManager<Token[]>;

    private networkEmitter: NetworkEmitter;
    private onCreateBuyOffer:
        | ((index: string, tokenId: string, amount: Amount) => void)
        | null;
    private client: xrplClient;

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        this.buyOffersStore = new StoreManager<OfferStore>({});
        this.sellOffersStore = new StoreManager<OfferStore>({});
        this.tokensStore = new StoreManager<Token[]>([]);
        this.networkEmitter = networkEmitter;
        this.onCreateBuyOffer = null;
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

            const createBuyOfferOff = this.networkEmitter.on(
                address,
                WalletEvents.CreateBuyOffer,
                this.onCreateBuyOffer
            );
        }

        return Promise.resolve([
            offerStore,
            () => {
                const released = this.store.releaseStore(address);
                console.log('released store for ', address);

                if (released && this.onCreateBuyOffer) {
                    console.log('removed listener for ', address);
                    this.networkEmitter.off(
                        address,
                        WalletEvents.CreateBuyOffer,
                        this.onCreateBuyOffer
                    );
                }
            },
        ]);
    }
}
