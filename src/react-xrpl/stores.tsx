import { BalanceStore } from './stores/balance/balance-store-manager';
import { BuyOffersStore } from './stores/buy-offers/buy-offers-store-manager';
import { CurrenciesStore } from './stores/currencies/currencies-store-manager';
import { SellOffersStore } from './stores/sell-offers/sell-offers-store-manager';
import { TokensStore } from './stores/tokens/tokens-store-manager';
import { TransactionLogStore } from './stores/transaction-log/transaction-log-store-manager';

type StoresProps = {
    children: React.ReactNode;
};

export function Stores({ children }: StoresProps) {
    return (
        <BalanceStore>
            <BuyOffersStore>
                <CurrenciesStore>
                    <SellOffersStore>
                        <TokensStore>
                            <TransactionLogStore>
                                {children}
                            </TransactionLogStore>
                        </TokensStore>
                    </SellOffersStore>
                </CurrenciesStore>
            </BuyOffersStore>
        </BalanceStore>
    );
}
