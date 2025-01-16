import {Operator} from "@/calculator/types.ts";
import {CalculationTree, ConstantNode, Node, OperatorNode, VariableNode} from "@/calculator/calculationTree.ts";

function isConstant(node: Node, constant: number | undefined = undefined): node is ConstantNode {
    return node instanceof ConstantNode && (constant === undefined || node.constant === constant);
}

function isVariable(node: Node, variable: string | undefined = undefined): node is VariableNode {
    return node instanceof VariableNode && (variable === undefined || node.variable === variable);
}

function isOperator(node: Node, operator: Operator | undefined = undefined): node is OperatorNode {
    return node instanceof OperatorNode && (operator === undefined || node.operator === operator);
}

abstract class TreeOptimization {
    abstract tryOptimize(node: Node): Node | undefined;
}

class OperatorIdentityOptimization extends TreeOptimization {
    tryOptimize(node: Node): Node | undefined {
        if (!isOperator(node)) {
            return undefined;
        }

        switch (node.operator) {
            case Operator.Addition:
                if (isConstant(node.left, 0)) {
                    return node.right;
                }
                if (isConstant(node.right, 0)) {
                    return node.left;
                }
                if (isVariable(node.left) && isVariable(node.right) && node.left.variable === node.right.variable && node.left.power === node.right.power) {
                    return new VariableNode(node.left.variable, node.left.power, node.left.multiplier + node.right.multiplier);
                }
                break;
            case Operator.Subtraction:
                if (isConstant(node.right, 0)) {
                    return node.left;
                }
                if (isConstant(node.right)) {
                    return new OperatorNode(node.left, new ConstantNode(-node.right.constant), Operator.Addition);
                }

                return new OperatorNode(node.left, new OperatorNode(new ConstantNode(-1), node.right, Operator.Multiplication), Operator.Addition);
            case Operator.Multiplication:
                if (isConstant(node.left, 0)) {
                    return node.left;
                }
                if (isConstant(node.right, 0)) {
                    return node.right;
                }
                if (isConstant(node.left, 1)) {
                    return node.right;
                }
                if (isConstant(node.right, 1)) {
                    return node.left;
                }
                if (isConstant(node.left) && isVariable(node.right)) {
                    return new VariableNode(node.right.variable, node.right.power, node.right.multiplier * node.left.constant);
                }
                if (isVariable(node.left) && isVariable(node.right, node.left.variable)) {
                    return new VariableNode(node.left.variable, node.left.power + node.right.power, node.left.multiplier * node.right.multiplier);
                }
                break;
            case Operator.Division:
                if (isConstant(node.right, 1)) {
                    return node.left;
                }
                if (isConstant(node.right)) {
                    return new OperatorNode(new ConstantNode(1 / node.right.constant), node.left, Operator.Multiplication);
                }
                if (isVariable(node.right)) {
                    return new OperatorNode(node.left, new VariableNode(node.right.variable, -node.right.power), Operator.Multiplication);
                }
                break;
            case Operator.Power:
                if (isConstant(node.left, 1) || isConstant(node.right, 1)) {
                    return node.left;
                }
                if (isConstant(node.right, 0)) {
                    return new ConstantNode(1);
                }

                if (isConstant(node.right) && isVariable(node.left)) {
                    return new VariableNode(node.left.variable, node.left.power * node.right.constant);
                }
                break;
        }

        return undefined;
    }
}

class ConstantOptimization extends TreeOptimization {
    tryOptimize(node: Node): Node | undefined {
        return isOperator(node)
        && isConstant(node.left)
        && isConstant(node.right)
            ? new ConstantNode(node.calculate())
            : undefined;
    }
}

class ConstantSortMergeOptimization extends TreeOptimization {
    tryOptimize(node: Node): Node | undefined {
        if (!isOperator(node, Operator.Addition) && !isOperator(node, Operator.Multiplication)) {
            return undefined;
        }

        if (isConstant(node.right) && !isConstant(node.left)) {
            return new OperatorNode(node.right, node.left, node.operator);
        }

        if (isConstant(node.left) && isOperator(node.right, node.operator) && isConstant(node.right.left)) {
            const newConst = new ConstantNode(new OperatorNode(node.left, node.right.left, node.operator).calculate());
            return new OperatorNode(newConst, node.right.right, node.operator);
        }

        return undefined;
    }
}

class NormalFormatOptimization extends TreeOptimization {
    tryOptimize(node: Node): Node | undefined {
        const rotation = this.tryRotateMultiplication(node);
        if (rotation !== undefined) {
            return rotation;
        }

        const generalRotation = this.tryGeneralRotation(node);
        if (generalRotation !== undefined) {
            return generalRotation;
        }

        const sort = this.trySortVariables(node);
        if (sort !== undefined) {
            return sort;
        }

        const merge = this.tryMerge(node);
        if (merge !== undefined) {
            return merge;
        }

        return undefined;
    }

    tryRotateMultiplication(node: Node): Node | undefined {
        if (!isOperator(node, Operator.Multiplication)) {
            return undefined;
        }

        function correctSubOp(operator: Operator) {
            return operator === Operator.Addition || operator === Operator.Subtraction;
        }

        let opNode: OperatorNode;
        let otherNode: Node;
        if (isOperator(node.left) && correctSubOp(node.left.operator)) {
            opNode = node.left;
            otherNode = node.right;
        } else if (isOperator(node.right) && correctSubOp(node.right.operator)) {
            opNode = node.right;
            otherNode = node.left;
        } else {
            return undefined;
        }

        const left = new OperatorNode(opNode.left, otherNode, Operator.Multiplication);
        const right = new OperatorNode(opNode.right, otherNode.clone(), Operator.Multiplication);

        return new OperatorNode(left, right, opNode.operator);
    }

    tryGeneralRotation(node: Node): Node | undefined {
        if (isOperator(node) && isOperator(node.left, node.operator)) {
            return new OperatorNode(node.left.left, new OperatorNode(node.left.right, node.right, node.operator), node.operator);
        }

        return undefined;
    }

    trySortVariables(node: Node): Node | undefined {
        if (!isOperator(node, Operator.Addition) && !isOperator(node, Operator.Multiplication)) {
            return undefined;
        }

        const l = node.left;
        const r = node.right;

        if (isVariable(l) && isVariable(r)) {
            if (l.variable !== r.variable && r.variable < l.variable
                || l.variable === r.variable && r.power > l.power) {
                return new OperatorNode(r, l, node.operator);
            }
        }

        if (isVariable(l) && isOperator(r, node.operator) && isVariable(r.left)) {
            const rl = r.left;
            if (l.variable !== rl.variable && rl.variable < l.variable
                || l.variable === rl.variable && rl.power > l.power) {
                return new OperatorNode(rl, new OperatorNode(l, r.right, node.operator), node.operator);
            }
        }

        return undefined;
    }

    tryMerge(node: Node): Node | undefined {
        if (!isOperator(node, Operator.Addition) && !isOperator(node, Operator.Multiplication)) {
            return undefined;
        }

        if (isOperator(node, Operator.Multiplication) && isConstant(node.left) && isOperator(node.right, node.operator) && isVariable(node.right.left)) {
            const newVariable = new VariableNode(node.right.left.variable, node.right.left.power, node.right.left.multiplier * node.left.constant);
            return new OperatorNode(newVariable, node.right.right, node.operator);
        }

        if (isVariable(node.left) && isOperator(node.right, node.operator) && isVariable(node.right.left, node.left.variable)) {
            if (isOperator(node, Operator.Multiplication)) {
                const newVariable = new VariableNode(node.left.variable, node.left.power + node.right.left.power, node.left.multiplier * node.right.left.multiplier);
                return new OperatorNode(newVariable, node.right.right, node.operator);
            }
            // if (isOperator(node, Operator.Addition) && node.left.power === node.right.left.power) {
            //     const newVariable = new VariableNode(node.left.variable, node.left.power, node.left.multiplier + node.right.left.multiplier);
            //     return new OperatorNode(newVariable, node.right.right, node.operator);
            // }
        }

        return undefined;
    }
}

const optimizationList: TreeOptimization[] = [
    new OperatorIdentityOptimization(),
    new ConstantOptimization(),
    new NormalFormatOptimization(),
    new ConstantSortMergeOptimization(),
];

interface OptimizationNode {
    node: Node;
    setter: (newNode: Node) => void;
}

function iterateOptimization(tree: CalculationTree, optimizers: TreeOptimization[]): boolean {
    const queue: OptimizationNode[] = [];
    const reverseQueue: OptimizationNode[] = [];
    queue.push({
        node: tree.root,
        setter: (newNode: Node) => tree.root = newNode,
    });

    while (queue.length > 0) {
        const on = queue.shift()!;
        reverseQueue.push(on);
        if (isOperator(on.node)) {
            queue.push({
                node: on.node.left,
                setter: (newNode: Node) => on.node.left = newNode,
            });
            queue.push({
                node: on.node.right,
                setter: (newNode: Node) => on.node.right = newNode,
            });
        }
    }

    reverseQueue.reverse();
    while (reverseQueue.length > 0) {
        const on = reverseQueue.shift()!;
        for (const optimization of optimizationList) {
            const newNode = optimization.tryOptimize(on.node);
            if (newNode !== undefined) {
                on.setter(newNode);
                return true;
            }
        }
    }

    return false;
}

export function optimizeTree(tree: CalculationTree): CalculationTree {
    const newTree = tree.clone();
    // console.log(newTree.toString());
    while (iterateOptimization(newTree, optimizationList)) {
        // console.log(newTree.toString());
    }
    // console.log(newTree);
    return newTree;
}