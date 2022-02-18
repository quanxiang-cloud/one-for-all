import moo from 'moo';

export default moo.compile({
  ws: /[ \t]+/,
  nl: { match: '\n', lineBreaks: true },
  AddSubOperator: ['+', '-'],
  MDOperator: ['*', '/', '%'],
  EXPOperator: ['^'],
  BinaryOperator: ['<=', '<', '>=', '>', '==', '!='],
  LogicalOperator: ['&&', '||'],
  CollectionOperator: ['∈', '∉'],
  MathFunction: ['sum', 'average', 'max', 'min', 'abs', 'ceil', 'floor'],
  lparan: '(',
  rparan: ')',
  comma: ',',
  // lbracket: "[",
  // rbracket: "]",
  lbrace: '{',
  rbrace: '}',
  StringLiteral: {
    match: /"(?:[^\n\\"]|\\["\\ntbfr])*"/,
    value: (s: string) => JSON.parse(s),
  },
  NumberLiteral: {
    match: /[0-9]+(?:\.[0-9]+)?/,
    value: (s: string) => s,
  },
  Variable: {
    match: /[a-zA-Z_$][a-zA-Z_0-9]*(?:\.(?:[a-zA-Z_0-9]+|\[\d+\]))*/,
  },
});
