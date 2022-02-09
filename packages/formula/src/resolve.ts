import { getValue } from "./get-value";
import {
  BinaryExpression,
  BinaryOperand,
  BinaryOperator,
  CollectionOperator,
  LogicalFormula,
  LogicalOperator,
  MathFunctionExpression,
  NumberLiteral,
  ParameterList,
  ResolvedValue,
  ResolveLogicalExpression,
  StringLiteral,
  Variable,
  Variables,
} from "./type";

function resolveLogicalExpression({ left, right, operator, variables }: ResolveLogicalExpression): ResolvedValue {
  if (operator === '&&') {
    return resolve(left, variables) && resolve(right, variables);
  }

  return resolve(left, variables) || resolve(right, variables);
}

type ResolveBinaryExpression = {
  left: BinaryOperand;
  operator: BinaryOperator;
  right: BinaryOperand;

}

function resolveBinaryExpression({ left, right, operator }: ResolveBinaryExpression, variables: Variables): ResolvedValue {
  const resolvedLeft = resolveBinaryOperand(left, variables);
  const resolvedRight = resolveBinaryOperand(right, variables);

  switch (operator) {
    case '<=':
      return resolvedLeft <= resolvedRight;
    case '<':
      return resolvedLeft < resolvedRight;
    case '>=':
      return resolvedLeft >= resolvedRight;
    case '>':
      return resolvedLeft > resolvedRight;
    case '==':
      return resolvedLeft === resolvedRight;
    case '!=':
      return resolvedLeft !== resolvedRight;
    case '+':
      return Number(resolvedLeft) + Number(resolvedRight);
    case '-':
      return Number(resolvedLeft) - Number(resolvedRight);
    case '*':
      return Number(resolvedLeft) * Number(resolvedRight);
    case '/':
      return Number(resolvedLeft) / Number(resolvedRight);
    case '%':
      return Number(resolvedLeft) % Number(resolvedRight);
    default:
      throw new Error(`unrecognized BinaryOperator: ${operator}`);
  }
}

function resolveBinaryOperand(operand: BinaryOperand, variables: Variables) {
  if (operand.type === 'BinaryExpression') {
    return resolveBinaryExpression(operand, variables);
  }

  return resolveOperand(operand, variables);
}

function resolveMathFunctionExpression({ funcName, params }: MathFunctionExpression, variables: Variables): number {
  const resolvedParams = params.map((param) => resolveOperand(param, variables)) as Array<number>;
  if (funcName === 'sum') {
    return resolvedParams.reduce((sum, current) => {
      return sum + current;
    });
  }

  if (funcName === 'average') {
    const result = resolvedParams.reduce((sum, current) => {
      return sum + current;
    }) / resolvedParams.length;
    return Number(result);
  }

  if (funcName === 'max') {
    return Math.max(...resolvedParams);
  }

  if (funcName === 'min') {
    return Math.min(...resolvedParams);
  }

  if (funcName === 'abs') {
    if (resolvedParams.length > 1) {
      console.warn('extra parameter passed to function [min] will be ignored');
    }
    return Math.abs(resolvedParams[0]);
  }

  if (funcName === 'ceil') {
    if (resolvedParams.length > 1) {
      console.warn('extra parameter passed to function [ceil] will be ignored');
    }
    return Math.ceil(resolvedParams[0]);
  }

  if (funcName === 'floor') {
    if (resolvedParams.length > 1) {
      console.warn('extra parameter passed to function [floor] will be ignored');
    }
    return Math.floor(resolvedParams[0]);
  }

  throw new Error(`unrecognized function name: ${funcName}`);
}

function resolveOperand(operand: StringLiteral | NumberLiteral | Variable | BinaryExpression | MathFunctionExpression, variables: Variables) {
  if (operand.type === 'Variable') {
    return getValue(variables, operand.name);
  }

  if (operand.type === 'NumberLiteral') {
    return Number(operand.value);
  }

  if (operand.type === 'MathFunctionExpression') {
    return resolveMathFunctionExpression(operand, variables)
  }

  if (operand.type === 'BinaryExpression') {
    return resolveBinaryExpression(operand, variables);
  }

  return operand.value;
}

type ResolveCollectionExpression = {
  left: StringLiteral | NumberLiteral | Variable;
  operator: CollectionOperator;
  right: ParameterList;
  variables: Variables;
}

function resolveCollectionExpression({ left, right, operator, variables }: ResolveCollectionExpression): boolean {
  const leftValue = resolveOperand(left, variables);
  const rightValues = right.map((parameter) => {
    return resolveOperand(parameter, variables);
  });

  if (operator === '∈') {
    return rightValues.includes(leftValue)
  }

  if (operator === '∉') {
    return !rightValues.includes(leftValue);
  }

  throw new Error(`unrecognized CollectionOperator: ${operator}`);
}

function resolve(logicalFormula: LogicalFormula, variables: Variables): ResolvedValue {
  if (logicalFormula.type === 'LogicalExpression') {
    return resolveLogicalExpression({
      left: logicalFormula.left,
      operator: logicalFormula.operator,
      right: logicalFormula.right,
      variables,
    });
  }

  if (logicalFormula.type === 'BinaryExpression') {
    return resolveBinaryExpression(
      { left: logicalFormula.left, operator: logicalFormula.operator, right: logicalFormula.right },
      variables,
    );
  }

  if (logicalFormula.type === 'CollectionExpression') {
    return resolveCollectionExpression({
      left: logicalFormula.left,
      operator: logicalFormula.operator,
      right: logicalFormula.right,
      variables,
    });
  }

  if (logicalFormula.type === 'MathFunctionExpression') {
    return resolveMathFunctionExpression(logicalFormula, variables);
  }

  if (
    logicalFormula.type === 'NumberLiteral' ||
    logicalFormula.type === 'StringLiteral' ||
    logicalFormula.type === 'Variable'
  ) {
    return resolveOperand(logicalFormula, variables);
  }

  throw new Error('unrecognized logicalFormula type: ${logicalFormula.type}');
}

export default function(logicalFormula: LogicalFormula, variables: Variables): ResolvedValue {
  const result = resolve(logicalFormula, variables);
  // 保留 4 位小数
  if (typeof result === 'number') {
    return Math.round(result * 10000) / 10000
  }

  return result;
}
