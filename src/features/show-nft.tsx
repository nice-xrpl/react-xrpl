import { useTokens } from "react-xrpl";

export function ShowNFT() {
    const tokens = useTokens();

    return (
        <div>
            Tokens
            {tokens.map((token) => {
                return (
                    <div key={token.id}>
                        {/* {token.issuer}{' - '} */}
                        {token.id}
                        {': '}
                        {token.uri}
                    </div>
                );
            })}
        </div>
    );
}