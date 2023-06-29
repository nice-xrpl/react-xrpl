import { useTokens } from 'react-xrpl';
import { Token } from './token';

export function ShowNFT() {
    const tokens = useTokens();

    return (
        <div>
            Tokens
            {tokens.map((token) => {
                return <Token key={token.id} id={token.id} uri={token.uri} />;
            })}
        </div>
    );
}
