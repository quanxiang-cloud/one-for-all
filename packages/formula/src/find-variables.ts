import { LogicalFormula, MathFunctionExpression } from "./type";

function findInMathExpression(expression: MathFunctionExpression, found: Set<string>): Set<string> {
  expression.params.forEach((param) => {
    if (param.type === 'Variable') {
      found.add(param.name);
    }

    if (param.type === 'MathFunctionExpression') {
      findInMathExpression(param, found);
    }

    if (param.type === 'BinaryExpression') {
      findVariables(param, found);
    }
  });

  return found;
}

function findVariables(logicalFormula: LogicalFormula, found: Set<string>): Set<string> {
  if (logicalFormula.type === 'Variable') {
    found.add(logicalFormula.name);
  }

  if (logicalFormula.type === 'MathFunctionExpression') {
    findInMathExpression(logicalFormula, found);
  }

  if (
    logicalFormula.type === 'LogicalExpression' ||
    logicalFormula.type === 'BinaryExpression'
  ) {
    findVariables(logicalFormula.left, found);
    findVariables(logicalFormula.right, found);
  }

  if (logicalFormula.type === 'CollectionExpression') {
    findVariables(logicalFormula.left, found);
    logicalFormula.right.forEach((param) => {
      findVariables(param, found);
    });
  }

  return found;
}

export default (logicalFormula: LogicalFormula) => {
  return findVariables(logicalFormula, new Set<string>());
}
