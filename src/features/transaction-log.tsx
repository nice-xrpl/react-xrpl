import { TransactionLogEntry, useTransactionLog } from 'react-xrpl';

function processEntry(entry: TransactionLogEntry) {
    if (entry.type === 'PaymentReceived') {
        return (
            <div key={entry.timestamp}>
                {entry.type} - {entry.payload.amount} from {entry.from}
            </div>
        );
    }

    if (entry.type === 'PaymentSent') {
        return (
            <div key={entry.timestamp}>
                {entry.type} - {entry.payload.amount} to {entry.to}
            </div>
        );
    }
}

export function TransactionLog() {
    const log = useTransactionLog();

    return (
        <div>
            {log.map((entry) => {
                return processEntry(entry);
            })}
        </div>
    );
}
