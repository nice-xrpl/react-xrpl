import { useWalletAddress } from './use-wallet-address';

function useTransactionLogInternal(accounts: string[]) {}

export function useTransactionLog(accounts?: string | string[]) {
    const address = useWalletAddress();

    if (address && !accounts) {
        // useTransactionLog()
        return useTransactionLogInternal([address]);
    }

    if (!address && typeof accounts === 'string') {
        // useTransactionLog(account)
        return useTransactionLogInternal([accounts]);
    }

    if (
        !address &&
        typeof accounts !== 'string' &&
        accounts &&
        accounts.length >= 0
    ) {
        // useTransactionLog([accounts])
        return useTransactionLogInternal(accounts);
    }

    // TODO: handle useTransactionLog(account/accounts) in a wallet. what is the behavior? throw error for now
    throw new Error(
        'Attempted to call useTransactionLog with an account within the scope of a wallet!  Use useTransactionLog without any arguments or use it outside the scope of wallet.'
    );
}
