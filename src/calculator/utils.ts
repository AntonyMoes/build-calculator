import {tokenize} from "@/calculator/tokenizer.ts";
import {validate} from "@/calculator/validator.ts";
import {tokenToString} from "@/components/calculator/calculator.ts";
import {toReversePolishNotation} from "@/calculator/reverser.ts";
import type {Token, TreeToken} from "@/calculator/types.ts";

export function validateVariables(tokenization: Token[], availableVariables: string[]): string[] {
    const missingVariables = [];
    for (const token of tokenization) {
        if (token.kind !== "variable") {
            continue;
        }

        if (!availableVariables.includes(token.value)) {
            missingVariables.push(token.value);
        }
    }

    return missingVariables;
}

export function parseAndValidate(formula: string, variables: string[]): {
    errors: string[];
    missingVariables: string[];
    tokenization: TreeToken[];
} {
    const result: {
        errors: string[];
        missingVariables: string[];
        tokenization: TreeToken[];
    } = {
        errors: [],
        missingVariables: [],
        tokenization: []
    };

    let tokenizationOrError = tokenize(formula);
    if (typeof tokenizationOrError === "string") {
        result.errors.push(tokenizationOrError);
        return result;
    }

    const tokenization = tokenizationOrError;
    const validationError = validate(tokenization);
    if (validationError !== undefined) {
        result.errors.push(`Error in token #${validationError.tokenIndex}: ${tokenToString(tokenization[validationError.tokenIndex])}`);
    }

    result.missingVariables = validateVariables(tokenization, variables);
    if (result.errors.length === 0 && result.missingVariables.length === 0) {
        result.tokenization = toReversePolishNotation(tokenization);
    }

    return result;
}