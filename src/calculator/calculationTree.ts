import {Operator, type TreeToken} from "@/calculator/types.ts";

const operationDictionary: {
    [key in Operator]: { (left: number, right: number): number };
} = {
    [Operator.Addition]: (left, right) => left + right,
    [Operator.Subtraction]: (left, right) => left - right,
    [Operator.Multiplication]: (left, right) => left * right,
    [Operator.Division]: (left, right) => left * right,
    [Operator.Power]: (left, right) => left ** right,
}

type VariableDictionary = Map<string, number>;

abstract class Node {
    abstract calculate(dictionary: VariableDictionary): number;
}

class OperatorNode extends Node {
    operator: Operator
    left: Node
    right: Node

    constructor(left: Node, right: Node, operator: Operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    calculate(dictionary: VariableDictionary): number {
        const operation = operationDictionary[this.operator];
        const left = this.left.calculate(dictionary);
        const right = this.right.calculate(dictionary);
        return operation(left, right);
    }
}

class ConstantNode extends Node {
    constant: number

    constructor(constant: number) {
        super();
        this.constant = constant;
    }

    calculate(dictionary: VariableDictionary): number {
        return this.constant;
    }
}

class VariableNode extends Node {
    variable: string

    constructor(variable: string) {
        super();
        this.variable = variable;
    }

    calculate(dictionary: VariableDictionary): number {
        return dictionary.has(this.variable) ? dictionary.get(this.variable)! : 0;
    }
}

function createNode(stack: TreeToken[], variables: string[]): Node {
    const token = stack.pop()!;
    switch (token.kind) {
        case "operator":
            const right = createNode(stack, variables);
            const left = createNode(stack, variables);
            return new OperatorNode(left, right, token.operator);
        case "variable":
            if (!variables.includes(token.value)) {
                variables.push(token.value);
            }
            return new VariableNode(token.value);
        case "constant":
            return new ConstantNode(token.value);
    }
}

export class CalculationTree {
    root: Node
    variables: string[]

    constructor(stack: TreeToken[]) {
        const copy = [...stack];
        if (copy.length === 0) {
            copy.push({kind: "constant", value: 0});
        }

        const variables: string[] = [];
        this.root = createNode(copy, variables);
        this.variables = variables.reverse();
    }

    calculate(dictionary: VariableDictionary) {
        return this.root.calculate(dictionary);
    }
}