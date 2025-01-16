import {Operator, operatorPriority, type TreeToken} from "@/calculator/types.ts";

const operationDictionary: {
    [key in Operator]: { (left: number, right: number): number };
} = {
    [Operator.Addition]: (left, right) => left + right,
    [Operator.Subtraction]: (left, right) => left - right,
    [Operator.Multiplication]: (left, right) => left * right,
    [Operator.Division]: (left, right) => left / right,
    [Operator.Power]: (left, right) => left ** right,
}

export type VariableDictionary = Map<string, number>;

export abstract class Node {
    abstract calculate(dictionary: VariableDictionary | undefined): number;

    abstract getSting(parentNode: Node | undefined): string;

    abstract clone(): Node;
}

export class OperatorNode extends Node {
    operator: Operator
    left: Node
    right: Node

    constructor(left: Node, right: Node, operator: Operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    calculate(dictionary: VariableDictionary | undefined = undefined): number {
        const operation = operationDictionary[this.operator];
        const left = this.left.calculate(dictionary);
        const right = this.right.calculate(dictionary);
        return operation(left, right);
    }

    getSting(parentNode: Node | undefined): string {
        const result = `${this.left.getSting(this)} ${this.operator} ${this.right.getSting(this)}`;
        return parentNode instanceof OperatorNode
        && (operatorPriority[parentNode.operator] > operatorPriority[this.operator]
            || parentNode.operator === Operator.Subtraction && parentNode.right === this)
            ? `(${result})`
            : result;
    }

    clone(): Node {
        return new OperatorNode(this.left.clone(), this.right.clone(), this.operator);
    }
}

export class ConstantNode extends Node {
    constant: number

    constructor(constant: number) {
        super();
        this.constant = constant;
    }

    calculate(dictionary: VariableDictionary | undefined = undefined): number {
        return this.constant;
    }

    getSting(parentNode: Node | undefined): string {
        return this.constant.toString();
    }

    clone(): Node {
        return new ConstantNode(this.constant);
    }
}

export class VariableNode extends Node {
    variable: string
    power: number
    multiplier: number

    constructor(variable: string, power: number | undefined = undefined, multiplier: number | undefined = undefined) {
        super();
        this.variable = variable;
        this.power = power ?? 1;
        this.multiplier = multiplier ?? 1;
    }

    calculate(dictionary: VariableDictionary | undefined): number {
        return dictionary !== undefined && dictionary.has(this.variable)
            ? this.multiplier * (dictionary.get(this.variable)! ** this.power)
            : 0;
    }

    getSting(parentNode: Node | undefined): string {
        const multiplier = this.multiplier === 1
            ? ""
            : `${this.multiplier}*`
        const power = this.power === 1
            ? ""
            : `^${this.power}`;
        return `${multiplier}${this.variable}${power}`;
    }

    clone(): Node {
        return new VariableNode(this.variable, this.power, this.multiplier);
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
        if (stack === undefined) {
            return;  // HACK
        }

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

    toString(): string {
        return this.root.getSting(undefined);
    }

    clone(): CalculationTree {
        const tree = new CalculationTree();
        tree.root = this.root.clone();
        tree.variables = [...this.variables];
        return tree;
    }
}