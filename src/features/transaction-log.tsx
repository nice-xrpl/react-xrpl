import { TransactionLogEntry, useTransactionLog } from 'react-xrpl';

function processEntry(entry: TransactionLogEntry) {
    if (entry.type === 'PaymentReceived') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Recieved {entry.payload.amount} from {entry.from}
            </div>
        );
    }

    if (entry.type === 'PaymentSent') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Sent {entry.payload.amount} to {entry.to}
            </div>
        );
    }

    if (entry.type === 'CurrencySent') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Sent {entry.payload.amount.currency} {entry.payload.amount.value} to {entry.to}
            </div>
        );
    }

    if (entry.type === 'CurrencyReceived') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Recieved {entry.payload.amount.currency} {entry.payload.amount.value} from {entry.from}
            </div>
        );
    }

    if (entry.type === 'CreateSellOffer') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Created sell offer for {entry.payload.token}
            </div>
        );
    }

    if (entry.type === 'AcceptSellOffer') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Accepted sell offer for {entry.payload.token}
            </div>
        );
    }

    if (entry.type === 'TokenMint') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Minted {entry.payload.token}
            </div>
        );
    }

    if (entry.type === 'TokenBurn') {
        return (
            <div key={entry.timestamp}>
                {entry.type}: Burned {entry.payload.token}
            </div>
        );
    }

    return <div>Unprocessed entry: {JSON.stringify(entry)}</div>;
}

export function TransactionLog({ account }: { account?: string }) {
    const log = useTransactionLog(account);

    return (
        <div>
            {log.map((entry) => {
                return processEntry(entry);
            })}
        </div>
    );
}
