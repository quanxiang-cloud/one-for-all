import { Token } from "moo";
export function tokenStart(token: Token) {
  return {
    line: token.line,
    col: token.col - 1
  };
}

export function tokenEnd(token: Token) {
  const lastNewLine = token.text.lastIndexOf("\n");
  if (lastNewLine !== -1) {
    throw new Error("Unsupported case: token with line breaks");
  }
  return {
    line: token.line,
    col: token.col + token.text.length - 1
  };
}

export function convertToken(token: Token) {
  return {
    type: token.type,
    value: token.value,
    // start: tokenStart(token),
    // end: tokenEnd(token)
  };
}

export function convertSignedNumber(sign: '-' | '+', token: Token) {
  const convertedToken = convertToken(token);
  if (sign === '+') {
    return convertedToken;
  }

  convertedToken.value = `-${convertedToken.value}`;

  return convertedToken;
}

export function convertTokenId(data: Array<Token>) {
  return convertToken(data[0]);
}

export function convertVariable(data: Array<Token>) {
  const token = data[0];
  return {
    type: token.type,
    name: token.value,
  };
}

export function convertOperator(data: Array<Token>) {
  return data[0].value;
}

export function convertLogicalExpression([left, , operator, , right]: Array<Token>) {
  return {
    type: 'LogicalExpression',
    left,
    operator: operator.value,
    right
  };
}

export function convertBinaryExpression([left, , operator, , right]: Array<Token>) {
  return {
    type: 'BinaryExpression',
    left,
    operator,
    right
  };
}

export function convertFunctionExpression(data: Array<Token>) {
  return {
    type: 'MathFunctionExpression',
    funcName: data[0].value,
    params: Array.isArray(data[4]) ? data[4] : [data[4]],
  };
}
