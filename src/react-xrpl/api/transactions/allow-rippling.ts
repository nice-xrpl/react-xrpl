import { Client as xrplClient, Wallet as xrplWallet, AccountSetAsfFlags, Transaction } from 'xrpl';

export async function allowRippling(client: xrplClient, wallet: xrplWallet, rippling: boolean) {
	await client.connect();
	
	let tx: Transaction = {
		TransactionType: 'AccountSet',
		Account: wallet.address
	};

	if (rippling) {
		tx.SetFlag = AccountSetAsfFlags.asfDefaultRipple
	} else {
		tx.ClearFlag = AccountSetAsfFlags.asfDefaultRipple
	}

	const result = await client.submitAndWait(tx, {
		autofill: true,
		wallet
	});

	return result;
}