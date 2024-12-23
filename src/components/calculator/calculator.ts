import {computed, type Ref, ref} from "vue";
import {Parenthesis, ParseError, type Token, type TreeToken} from "@/calculator/types.ts";
import {CalculationTree} from "@/calculator/calculationTree.ts";
import {tokenize} from "@/calculator/tokenizer.ts";
import {validate} from "@/calculator/validator.ts";
import {toReversePolishNotation} from "@/calculator/reverser.ts";

function tokenToString(token: Token): string {
    switch (token.kind) {
        case "openParenthesis":
            return Parenthesis.Open;
        case "operator":
            return token.operator;
        case "variable":
            return token.value;
        case "constant":
            return token.value.toString();
        case "closeParenthesis":
            return Parenthesis.Close;
    }
}


function calculator() {
    const input = ref("");
    const error: Ref<string | undefined> = ref(undefined);
    const tokenization = computed(() => getTokenization(input.value));
    const tree = computed(() => getTree(tokenization.value, error.value));

    function getTokenization(input: string): Token[] | undefined {
        let tokenizationOrError = tokenize(input);
        if (typeof tokenizationOrError === "string") {
            error.value = tokenizationOrError;
            return undefined;
        }

        const tokenization = tokenizationOrError;
        const validationError = validate(tokenization);
        if (validationError !== undefined) {
            error.value = `Error in token #${validationError.tokenIndex}: ${tokenToString(tokenization[validationError.tokenIndex])}`;
        } else {
            error.value = undefined;
        }

        return tokenization;
    }

    function getTree(tokenization: Token[] | undefined, error: string | undefined): CalculationTree | undefined {
        if (tokenization === undefined || error !== undefined) {
            return undefined;
        }

        const stack = toReversePolishNotation(tokenization);
        return new CalculationTree(stack);
    }

    // const logic = () => {
    //     error.value = undefined;
    //     tree.value = undefined;
    //     tokenization.value = [];
    //
    //     try {
    //         tokenization.value = tokenize(input.value);
    //     } catch (e) {
    //         const parseError = e as ParseError;
    //         error.value = parseError.toString();
    //         return;
    //     }
    //
    //     const validationError = validate(tokenization.value);
    //     if (validationError !== undefined) {
    //         error.value = `Error in token #${validationError.tokenIndex}: ${tokenToString(tokenization.value[validationError.tokenIndex])}`;
    //         return;
    //     }
    //
    //     const stack = toReversePolishNotation(tokenization.value);
    //     tree.value = new CalculationTree(stack);
    // }
    //
    // logic();

    return {input, tokenization, tree, error};
}

export {calculator, tokenToString}