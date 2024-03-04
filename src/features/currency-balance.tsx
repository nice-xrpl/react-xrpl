import { useCurrencyBalance } from 'react-xrpl';

export function CurrencyBalance() {
    const currencies = useCurrencyBalance();

    return (
        <div>
            {currencies.map((currency) => {
                return (
                    <div key={`${currency.issuer}-${currency.currency}`}>
                        {currency.value} {currency.currency}
                    </div>
                );
            })}
        </div>
    );
}
