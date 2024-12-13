import {parseEnum} from "@/utils/utils.ts";
import {isAlpha, isAlphaNumeric, isWhiteSpace} from "@/utils/stringUtils.ts";
import {type OperandToken, Operator, Parenthesis, ParseError, type Token} from "@/calculator/types.ts";

class ParseCharacterResult {
    error: boolean = false;
    newTokens: Token[] = [];
    startNewToken: boolean = true;
}

function tokenize(input: string): Token[] {
    let currentToken = "";
    let tokens: Token[] = [];

    for (let i = 0; i <= input.length; i++) {
        const currentCharacter = i < input.length ? input[i] : undefined;
        const parseResult = parseCharacter(currentCharacter, currentToken);
        if (parseResult.error) {
            throw new ParseError(`Could not parse ${currentToken}`);
        }

        if (parseResult.newTokens.length > 0) {
            tokens = tokens.concat(parseResult.newTokens);
        }

        if (parseResult.startNewToken) {
            currentToken = "";
        } else {
            currentToken += currentCharacter;
        }
    }

    return tokens;
}

function parseCharacter(currentCharacter: string | undefined, currentToken: string): ParseCharacterResult {
    const result = new ParseCharacterResult();
    const tryParseOperand = () => {
        const operand = parseOperand(currentToken);
        if (operand === null) {
            result.error = true;
            return;
        }

        if (operand !== undefined) {
            result.newTokens.push(operand);
        }
    };

    const parenthesis = parseEnum(Parenthesis, currentCharacter);
    if (parenthesis !== undefined) {
        tryParseOperand();
        switch (parenthesis) {
            case Parenthesis.Open:
                result.newTokens.push({
                    kind: "openParenthesis",
                });
                break;
            case Parenthesis.Close:
                result.newTokens.push({
                    kind: "closeParenthesis",
                });
                break;
        }
        return result;
    }

    const operator = parseEnum(Operator, currentCharacter);
    if (operator !== undefined) {
        tryParseOperand();
        result.newTokens.push({
            kind: "operator",
            operator: operator,
        });
        return result;
    }

    if (currentCharacter === undefined || isWhiteSpace(currentCharacter)) {
        tryParseOperand();
    } else {
        result.startNewToken = false;
    }

    return result;
}

function parseOperand(token: string): OperandToken | undefined | null {
    if (token.length === 0) {
        return undefined;
    }

    const number = Number(token);
    if (!isNaN(number)) {
        return {
            kind: "constant",
            value: number,
        };
    }

    if (isAlphaNumeric(token) && isAlpha(token[0])) {
        return {
            kind: "variable",
            value: token
        }
    }

    return null;
}

export {tokenize};