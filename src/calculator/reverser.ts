import {operatorPriority, type OperatorToken, type Token, type TreeToken} from "@/calculator/types.ts";

const parenthesisPriorityChange: {
    [key: string]: number;
} = {
    ["openParenthesis"]: 10,
    ["closeParenthesis"]: -10,
}

interface StackOperator {
    operator: OperatorToken
    priority: number
}


export function toReversePolishNotation(tokens: Token[]): TreeToken[] {
    const result: TreeToken[] = [];
    const operatorStack: StackOperator[] = [];
    let additionalPriority = 0;

    for (const token of tokens) {
        switch (token.kind) {
            case "openParenthesis":
            case "closeParenthesis":
                additionalPriority += parenthesisPriorityChange[token.kind];
                break;
            case "operator":
                const priority = operatorPriority[token.operator] + additionalPriority;
                while (operatorStack.length > 0 && priority <= operatorStack[operatorStack.length - 1].priority) {
                    result.push(operatorStack.pop()!.operator);
                }

                operatorStack.push({
                    operator: token,
                    priority: priority
                });
                break;
            case "variable":
            case "constant":
                result.push(token);
                break;
        }
    }

    while (operatorStack.length > 0) {
        result.push(operatorStack.pop()!.operator);
    }

    return result;
}