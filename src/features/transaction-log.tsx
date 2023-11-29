import { useTransactionLog } from 'react-xrpl';

export function TransactionLog() {
    const log = useTransactionLog();

    return (
        <div>
            {log.map((entry) => {
                return <div key={entry.timestamp}>{entry.type}</div>;
            })}
        </div>
    );
}
