import { getBalances, getBuyOffers, getSellOffers } from '../api/requests';
import { Amount, Client as xrplClient } from 'xrpl';
import { createStore, Store } from '../stores/create-store';
import { Offer, OfferStore } from 'react-xrpl/api';

export class SellOfferStore {
    private _store: Store<OfferStore>;
    private _client: xrplClient;
    private _address: string;

    constructor(client: xrplClient, address: string) {
        this._store = createStore<OfferStore>({});
        this._client = client;
        this._address = address;

        this.onCreateSellOffer = this.onCreateSellOffer.bind(this);
        this.onAcceptSellOffer = this.onAcceptSellOffer.bind(this);
    }

    public getStore() {
        return this._store;
    }

    public async setInitialSellOffers(tokenId: string) {
        const sellOffers = await getSellOffers(this._client, tokenId).catch(
            (error) => {
                // TODO: silently ignore if not found error as this can indicate no offers exist
                console.log('error in getSellOffers: ', error);

                return [] as Offer[];
            }
        );
        console.log('initial sell offers store: ', tokenId, [...sellOffers]);

        this._store.setState((state) => {
            return {
                ...state,
                [tokenId]: sellOffers,
            };
        });

        return { [tokenId]: sellOffers };
    }

    public onCreateSellOffer(index: string, tokenId: string, amount: Amount) {
        getSellOffers(this._client, tokenId)
            .then((sellOffers) => {
                this._store.setState((state) => {
                    return {
                        ...state,
                        [tokenId]: sellOffers,
                    };
                });
            })
            .catch((err) => {});
    }

    public onAcceptSellOffer(index: string, tokenId: string) {
        this.onCreateSellOffer(index, tokenId, '0');
    }
}
