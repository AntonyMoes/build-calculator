import type {Token} from "@/calculator/types.ts";

const allowedCombinations: {
    [key: string]: string[]
} = {
    ["start"]: ["openParenthesis", "variable", "constant", "end"],
    ["openParenthesis"]: ["variable", "constant", "openParenthesis"],
    ["closeParenthesis"]: ["operator", "closeParenthesis", "end"],
    ["variable"]: ["operator", "closeParenthesis", "end"],
    ["constant"]: ["operator", "closeParenthesis", "end"],
    ["operator"]: ["variable", "constant", "openParenthesis"],
}

const parenthesisCounterDelta: {
    [key: string]: number
} = {
    ["openParenthesis"]: 1,
    ["closeParenthesis"]: -1,
}

interface StartToken {
    kind: "start"
}

interface EndToken {
    kind: "end"
}

type ValidationToken = Token | StartToken | EndToken;

function validate(tokens: Token[]): { tokenIndex: number } | undefined {
    const startToken: StartToken = {
        kind: "start",
    };

    const endToken: EndToken = {
        kind: "end",
    }

    const validationTokens: ValidationToken[] = ([startToken] as ValidationToken[])
        .concat(tokens)
        .concat(([endToken] as ValidationToken[]));

    let parenthesisCounter = 0;

    for (let i = 0; i < validationTokens.length - 1; i++) {
        const token = validationTokens[i];
        const nextToken = validationTokens[i + 1];
        if (!allowedCombinations[token.kind].includes(nextToken.kind)) {
            const index = i == validationTokens.length - 2 ? i - 1 : i;
            return {
                tokenIndex: index,
            }
        }

        if (token.kind in parenthesisCounterDelta) {
            parenthesisCounter += parenthesisCounterDelta[token.kind];
            if (parenthesisCounter < 0) {
                return {
                    tokenIndex: i - 1,
                }
            }
        }
    }

    if (parenthesisCounter > 0) {
        return {
            tokenIndex: tokens.length - 1,
        }
    }

    return undefined;
}

export { validate };