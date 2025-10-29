import { TransactionStream, Client as xrplClient } from 'xrpl';
import { AddressEvents, EventMap, WalletEvents } from './types';
import { EventEmitter } from 'tseep';
import { BalanceStore } from './balance-store';
import { BuyOfferStore } from './buy-offer-store';
import { SellOfferStore } from './sell-offer-store';
import { TokenStore } from './token-store';
import { CurrencyStore } from './currency-store';
import { WalletEvent } from '../api/network-emitter';

export class NetworkEmitter {
    private _client: xrplClient;
    private _eventsEnabled: boolean = false;
    private _addressEvents: Map<string, AddressEvents>;

    constructor(client: xrplClient) {
        this._client = client;
        this._addressEvents = new Map<string, AddressEvents>();
    }

    public start() {
        if (!this._eventsEnabled) {
            this._client.on('transaction', this.onTransaction);
            this._eventsEnabled = true;
        }
    }

    public stop() {
        if (this._eventsEnabled) {
            this._client.off('transaction', this.onTransaction);
            this._eventsEnabled = false;
        }
    }

    private getEvents(address: string) {
        let events = this._addressEvents.get(address);

        if (!events) {
            events = {
                emitter: new EventEmitter<EventMap>(),
                refCount: 0,
                address: address,
                promiseChain: Promise.resolve(),
                balance: new BalanceStore(this._client, address),
                currencies: new CurrencyStore(this._client, address),
                tokens: new TokenStore(this._client, address),
                buyOffers: new BuyOfferStore(this._client, address),
                sellOffers: new SellOfferStore(this._client, address),
                subbed: false,
            };

            this._addressEvents.set(address, events);
        }

        return events;
    }

    public async enableEventsForAddress(address: string) {
        const events = this.getEvents(address);

        events.refCount++;

        events.promiseChain = events.promiseChain.then(async () => {
            if (events.refCount > 0 && !events.subbed) {
                try {
                    await this._client.request({
                        command: 'subscribe',
                        // TODO: either accounts OR streams has to be specified.  each one gives independent events (ex. if accounts is a wallet and streams is transactions, then you will get two independent streams of events, one for accounts and one for streams)
                        accounts: [address],
                    });

                    // queue up initial values
                    events.balance.setInitialBalance();
                    events.currencies.setInitialBalance();
                    events.tokens.setInitialTokens();

                    // set event listeners
                    events.emitter.on(
                        WalletEvents.BalanceChange,
                        events.balance.onBalanceChange
                    );
                    events.emitter.on(
                        WalletEvents.CurrencyChange,
                        events.currencies.onCurrencyChange
                    );
                    events.emitter.on(
                        WalletEvents.TokenMint,
                        events.tokens.onTokenMint
                    );
                    events.emitter.on(
                        WalletEvents.TokenBurn,
                        events.tokens.onTokenBurn
                    );
                    events.emitter.on(
                        WalletEvents.CreateBuyOffer,
                        events.buyOffers.onCreateBuyOffer
                    );
                    events.emitter.on(
                        WalletEvents.CreateSellOffer,
                        events.sellOffers.onCreateSellOffer
                    );
                    events.emitter.on(
                        WalletEvents.AcceptBuyOffer,
                        events.buyOffers.onAcceptBuyOffer
                    );
                    events.emitter.on(
                        WalletEvents.AcceptSellOffer,
                        events.sellOffers.onAcceptSellOffer
                    );

                    events.subbed = true;
                } catch (error) {
                    console.error('error subscribing to address: ', error);
                }
            }
        });

        return events.promiseChain;
    }

    public async disableEventsForAddress(address: string) {
        const events = this.getEvents(address);

        events.refCount--;

        events.promiseChain = events.promiseChain.then(async () => {
            if (events.refCount <= 0 && events.subbed) {
                try {
                    await this._client.request({
                        command: 'unsubscribe',
                        accounts: [address],
                    });

                    events.subbed = false;
                } catch (error) {
                    console.error('error unsubscribing from address: ', error);
                }
            }

            if (events.refCount <= 0 && !events.subbed) {
                events.emitter.removeAllListeners();
                this._addressEvents.delete(address);
            }
        });

        return events.promiseChain;
    }

    public hasEventsForAddress(address: string) {
        const events = this.getEvents(address);

        return events.subbed;
    }

    public getBalanceStore(address: string) {
        const events = this.getEvents(address);
        return events.balance;
    }

    public getCurrencyStore(address: string) {
        const events = this.getEvents(address);
        return events.currencies;
    }

    public getTokenStore(address: string) {
        const events = this.getEvents(address);
        return events.tokens;
    }

    public getBuyOfferStore(address: string) {
        const events = this.getEvents(address);
        return events.buyOffers;
    }

    public getSellOfferStore(address: string) {
        const events = this.getEvents(address);
        return events.sellOffers;
    }

    public on<T extends WalletEvent>(
        address: string,
        event: T,
        callback: EventMap[T]
    ) {
        const events = this.getEvents(address);
        events.emitter.on(event, callback);

        return () => {
            events.emitter.off(event, callback);
        };
    }

    public off<T extends WalletEvent>(
        address: string,
        event: T,
        callback: EventMap[T]
    ) {
        const events = this.getEvents(address);
        events.emitter.off(event, callback);
    }

    private onTransaction = (tx: TransactionStream) => {};
}
