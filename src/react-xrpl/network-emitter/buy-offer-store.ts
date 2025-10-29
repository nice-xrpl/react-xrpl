import { getBalances, getBuyOffers } from '../api/requests';
import { Amount, Client as xrplClient } from 'xrpl';
import { createStore, Store } from '../stores/create-store';
import { Offer, OfferStore } from 'react-xrpl/api';

export class BuyOfferStore {
    private _store: Store<OfferStore>;
    private _client: xrplClient;
    private _address: string;

    constructor(client: xrplClient, address: string) {
        this._store = createStore<OfferStore>({});
        this._client = client;
        this._address = address;

        this.onCreateBuyOffer = this.onCreateBuyOffer.bind(this);
        this.onAcceptBuyOffer = this.onAcceptBuyOffer.bind(this);
    }

    public getStore() {
        return this._store;
    }

    public async setInitialBuyOffers(tokenId: string) {
        const buyOffers = await getBuyOffers(this._client, tokenId).catch(
            (error) => {
                // TODO: silently ignore if not found error as this can indicate no offers exist
                console.log('error in getBuyOffers: ', error);

                return [] as Offer[];
            }
        );
        console.log('initial buy offers store: ', tokenId, [...buyOffers]);

        this._store.setState((state) => {
            return {
                ...state,
                [tokenId]: buyOffers,
            };
        });

        return { [tokenId]: buyOffers };
    }

    public onCreateBuyOffer(index: string, tokenId: string, amount: Amount) {
        getBuyOffers(this._client, tokenId)
            .then((buyOffers) => {
                this._store.setState((state) => {
                    return {
                        ...state,
                        [tokenId]: buyOffers,
                    };
                });
            })
            .catch((err) => {});
    }

    public onAcceptBuyOffer(index: string, tokenId: string) {
        this.onCreateBuyOffer(index, tokenId, '0');
    }
}
