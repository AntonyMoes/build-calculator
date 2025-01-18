import {
    CalculationTree,
    ConstantNode,
    Node,
    OperatorNode,
    type VariableDictionary,
    VariableNode
} from "@/calculator/calculationTree.ts";
import {Operator, type TreeToken} from "@/calculator/types.ts";
import {optimizeTree} from "@/calculator/optimizer.ts";

function getGradientTree(from: DifferentiationTree, variable: string): CalculationTree {
    const tree = from.clone();
    differentiate(tree, variable);
    return tree;
}

function differentiate(tree: CalculationTree, variable: string) {
    function isAddition(node: Node): node is OperatorNode {
        return node instanceof OperatorNode && node.operator === Operator.Addition;
    }

    tree.root = new OperatorNode(new ConstantNode(0), tree.root, Operator.Addition);

    const queue: OperatorNode[] = [tree.root as OperatorNode];
    while (queue.length > 0) {
        const node = queue.shift()!;
        for (const [child, setter] of [[node.left, (n: Node) => node.left = n], [node.right, (n: Node) => node.right = n]]) {
            if (isAddition(child)) {
                queue.push(child);
            } else if (!differentiateGroup(child, variable)){
                setter(new ConstantNode(0));
            }
        }
    }
}

function differentiateGroup(currentNode: Node, variable: string): boolean {
    if (currentNode instanceof VariableNode && currentNode.variable === variable) {
        currentNode.multiplier *= currentNode.power;
        currentNode.power -= 1;
        return true;
    }

    if (currentNode instanceof OperatorNode) {
        return differentiateGroup(currentNode.left, variable)
            ? true
            : differentiateGroup(currentNode.right, variable);

    }

    return false;
}

export class DifferentiationTree extends CalculationTree {
    gradientTrees: Map<string, CalculationTree>;

    constructor(input: TreeToken[] | CalculationTree) {
        if (input instanceof CalculationTree) {
            super(undefined);
            const clone = input.clone();
            this.root = clone.root;
            this.variables = clone.variables;
        } else {
            super(input);
        }

        const result = optimizeTree(this);
        this.root = result.root;

        this.gradientTrees = new Map<string, CalculationTree>();
        for (const variable of this.variables) {
            this.gradientTrees.set(variable, getGradientTree(this, variable));
        }
    }

    calculateGradient(pointDictionary: VariableDictionary): VariableDictionary {
        // console.log(this.toString());
        for (const tree of this.gradientTrees.values()) {
            // console.log(tree.toString());
        }

        const result = new Map<string, number>();
        for (const [variable, tree] of this.gradientTrees.entries()) {
            result.set(variable, tree.calculate(pointDictionary));
        }

        return result;
    }
}