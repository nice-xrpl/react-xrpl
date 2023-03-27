import { Wallet as xrplWallet } from 'xrpl';

export type Currency = {
	issuer: string;
	value: number;
	currency: string;
}

export type Token = {
	flags: number;
	issuer: string;
	id: string;
	taxon: number;
	uri: string;
}

export type Offer = {
	id: string;
	amount: string;
	owner: string;
	expiration?: number;
	destination?: string;
}

export type WalletInitialState = {
	// wallet: xrplWallet;
	balance: number;
	currencies: Currency[];
	tokens: Token[];
	sellOffers: Offer[];
	buyOffers: Offer[];
}

export type XRPLWalletInitialState = WalletInitialState & {
	wallet: xrplWallet
}