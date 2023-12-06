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
