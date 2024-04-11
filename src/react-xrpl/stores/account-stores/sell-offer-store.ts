import { getSellOffers } from '../../api/requests';
import { NetworkEmitter, WalletEvents } from '../../api/network-emitter';
import { StoreManager } from '../store-manager';
import { Amount, Client as xrplClient } from 'xrpl';
import { OfferStore } from '../../api/wallet-types';

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

    constructor(client: xrplClient, networkEmitter: NetworkEmitter) {
        super({});

        this.networkEmitter = networkEmitter;
        this.onCreateSellOffer = null;
        this.onAcceptSellOffer = null;
        this.client = client;
    }

    public async setInitialSellOffers(address: string, tokenId: string) {
        const [store] = this.getStore(address);
        const sellOffers = await getSellOffers(this.client, tokenId);
        console.log('initial sell offers store: ', tokenId, [...sellOffers]);

        store.setState((state) => {
            return {
                ...state,
                [tokenId]: sellOffers,
            };
        });

        return sellOffers;
    }

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
