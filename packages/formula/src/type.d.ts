type CollectionOperator = '∈' | '∉';
type BinaryOperator = '<=' | '<' | '>=' | '>' | '==' | '!=' | '+' | '-' | '*' | '/' | '%';
type LogicalOperator = '||' | '&&';

type StringLiteral = {
  type: 'StringLiteral';
  value: string;
}

export type NumberLiteral = {
  type: 'NumberLiteral';
  value: number;
}

export type Variable = {
  type: 'Variable';
  name: string;
}

export type ParameterList = Array<StringLiteral | NumberLiteral | Variable>;

export type CollectionExpression = {
  type: 'CollectionExpression';
  left: StringLiteral | NumberLiteral | Variable;
  operator: CollectionOperator;
  right: ParameterList;
}

export type MathFunctionExpression = {
  type: 'MathFunctionExpression';
  funcName: string;
  params: Array<MathFunctionExpression | NumberLiteral | Variable | BinaryExpression>;
}

export type BinaryOperand = NumberLiteral | StringLiteral | Variable | BinaryExpression | MathFunctionExpression;

export type BinaryExpression = {
  type: 'BinaryExpression';
  left: BinaryOperand;
  operator: BinaryOperator;
  right: BinaryOperand;
}

export type LogicalExpression = {
  type: 'LogicalExpression';
  left: LogicalExpression | BinaryExpression | CollectionExpression;
  operator: LogicalOperator;
  right: LogicalExpression | BinaryExpression | CollectionExpression;
}

export type LogicalFormula =
  LogicalExpression |
  BinaryExpression |
  CollectionExpression |
  MathFunctionExpression |
  NumberLiteral |
  StringLiteral |
  Variable;

export type Variables = Record<string, any>;

export type ResolveLogicalExpression = {
  left: LogicalFormula;
  operator: LogicalOperator;
  right: LogicalFormula;
  variables: Variables;
}

export type ResolvedValue = boolean | string | number;

export function findVariables(logicalFormula: LogicalFormula): Set<string>;

export function parse(formula: string): LogicalFormula;

export function resolve(logicalFormula: LogicalFormula, variables: Variables): ResolvedValue;

// export type FormulaNodeVariable = {
//   type: 'variable',
//   name: string,
// }

// export type FormulaNodeString = {
//   type: 'string',
//   value: string,
// }

// export type FormulaNodeNumber = {
//   type: 'number',
//   value: number,
// }

// export type FormulaNodeFunction = {
//   type: 'function',
//   name: string,
//   args: FormulaNode[],
// }

// export type FormulaNodeBlock = {
//   type: 'block',
//   child: FormulaNode,
// }

// type FormulaNodeOneValue<Type> = {
//   type: Type,
//   value: FormulaNode,
// }

// // Sign changers
// export type FormulaNodePositive = FormulaNodeOneValue<'positive'>
// export type FormulaNodeNegative = FormulaNodeOneValue<'negative'>
// export type FormulaNodePositiveNegative = FormulaNodeOneValue<'positive-negative'>

// type FormulaNodeTwoValues<Type> = {
//   type: Type,
//   a: FormulaNode,
//   b: FormulaNode,
// }

// // Operators
// export type FormulaNodePlus = FormulaNodeTwoValues<'plus'>
// export type FormulaNodeMinus = FormulaNodeTwoValues<'minus'>
// export type FormulaNodePlusMinus = FormulaNodeTwoValues<'plus-minus'>
// export type FormulaNodeMultiplyImplicit = FormulaNodeTwoValues<'multiply-implicit'>
// export type FormulaNodeMultiplyDot = FormulaNodeTwoValues<'multiply-dot'>
// export type FormulaNodeMultiplyCross = FormulaNodeTwoValues<'multiply-cross'>
// export type FormulaNodeDivideFraction = FormulaNodeTwoValues<'divide-fraction'>
// export type FormulaNodeDivideInline = FormulaNodeTwoValues<'divide-inline'>
// export type FormulaNodePower = FormulaNodeTwoValues<'power'>

// // Comparison
// export type FormulaNodeEquals = FormulaNodeTwoValues<'equals'>
// export type FormulaNodeLessThan = FormulaNodeTwoValues<'less-than'>
// export type FormulaNodeGreaterThan = FormulaNodeTwoValues<'greater-than'>
// export type FormulaNodeLessThanEquals = FormulaNodeTwoValues<'less-than-equals'>
// export type FormulaNodeGreaterThanEquals = FormulaNodeTwoValues<'greater-than-equals'>
// export type FormulaNodeApproximates = FormulaNodeTwoValues<'approximates'>

// export type FormulaNodeMatrix = {
//   type: 'matrix',
//   n: number,
//   m: number,
//   values: FormulaNode[][],
// }

// export type FormulaNodeOperandPlaceholder = {
//   type: 'operand-placeholder',
// }

// export type FormulaNodeFunctionPlaceholder = {
//   type: 'function-placeholder',
//   args: FormulaNode[],
// }
// export type FormulaNodeOperatorPlaceholder = FormulaNodeTwoValues<'operator-placeholder'>
// export type FormulaNodeOperatorUnaryPlaceholder = FormulaNodeOneValue<'operator-unary-placeholder'>

// export type FormulaNode =
//   | FormulaNodeVariable
//   | FormulaNodeNumber
//   | FormulaNodePositive
//   | FormulaNodeNegative
//   | FormulaNodePositiveNegative
//   | FormulaNodeFunction
//   | FormulaNodeBlock
//   | FormulaNodePlus
//   | FormulaNodeMinus
//   | FormulaNodePlusMinus
//   | FormulaNodeMultiplyImplicit
//   | FormulaNodeMultiplyDot
//   | FormulaNodeMultiplyCross
//   | FormulaNodeDivideFraction
//   | FormulaNodeDivideInline
//   | FormulaNodePower
//   | FormulaNodeEquals
//   | FormulaNodeLessThan
//   | FormulaNodeGreaterThan
//   | FormulaNodeLessThanEquals
//   | FormulaNodeGreaterThanEquals
//   | FormulaNodeApproximates
//   | FormulaNodeMatrix
//   | FormulaNodeOperandPlaceholder
//   | FormulaNodeFunctionPlaceholder
//   | FormulaNodeOperatorPlaceholder
//   | FormulaNodeOperatorUnaryPlaceholder
