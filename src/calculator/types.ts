export class ParseError extends Error {}

export enum Operator {
    Addition = "+",
    Subtraction = "-",
    Multiplication = "*",
    Division = "/",
    Power = "^",
}

export enum Parenthesis {
    Open = "(",
    Close = ")",
}
export interface OperatorToken {
    kind: "operator"
    operator: Operator
}

export interface VariableToken {
    kind: "variable"
    value: string
}

export interface ConstantToken {
    kind: "constant"
    value: number
}

export interface OpenParenthesisToken {
    kind: "openParenthesis",
}

export interface CloseParenthesisToken {
    kind: "closeParenthesis",
}

export type OperandToken = VariableToken | ConstantToken;
export type TreeToken = OperatorToken | OperandToken;
export type Token = TreeToken | OpenParenthesisToken | CloseParenthesisToken;

export const operatorPriority: {
    [key in Operator]: number;
} = {
    [Operator.Addition]: 0,
    [Operator.Subtraction]: 0,
    [Operator.Multiplication]: 1,
    [Operator.Division]: 1,
    [Operator.Power]: 2,
}
