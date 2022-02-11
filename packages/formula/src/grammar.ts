// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var Variable: any;
declare var NumberLiteral: any;
declare var StringLiteral: any;
declare var LogicalOperator: any;
declare var CollectionOperator: any;
declare var BinaryOperator: any;
declare var AddSubOperator: any;
declare var MDOperator: any;
declare var EXPOperator: any;
declare var ws: any;

// Moo lexer documention is here:
// https://github.com/no-context/moo
import lexer from './lexer';
import {
  tokenStart,
  tokenEnd,
  convertToken,
  convertTokenId,
  convertSignedNumber,
  convertVariable,
  convertLogicalExpression,
  convertBinaryExpression,
  convertFunctionExpression,
  convertOperator,
} from './convertor';

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "main", "symbols": ["LogicalExpression"], "postprocess": id},
    {"name": "LogicalExpression", "symbols": ["LogicalExpression", "_", {"literal":"||"}, "_", "LogicalExpression"], "postprocess": convertLogicalExpression},
    {"name": "LogicalExpression", "symbols": ["LogicalExpression", "_", {"literal":"&&"}, "_", "LogicalExpression"], "postprocess": convertLogicalExpression},
    {"name": "LogicalExpression", "symbols": ["CollectionExpression"], "postprocess": id},
    {"name": "LogicalExpression", "symbols": ["BinaryExpression"], "postprocess": id},
    {"name": "LogicalExpression", "symbols": ["MathExpression"], "postprocess": id},
    {"name": "LogicalExpression", "symbols": ["P"], "postprocess": id},
    {"name": "P", "symbols": [{"literal":"("}, "_", "LogicalExpression", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "P", "symbols": [{"literal":"("}, "_", "BinaryExpression", "_", {"literal":")"}], "postprocess": (d) => d[2]},
    {"name": "CollectionExpression", "symbols": ["ListOperand", "_", "CollectionOperator", "_", {"literal":"{"}, "_", "ParameterList", "_", {"literal":"}"}], "postprocess": 
        (d) => ({
          type: 'CollectionExpression',
          left: d[0],
          operator: d[2],
          right: d[6]
        })
             },
    {"name": "BinaryExpression", "symbols": ["BinaryOperand", "_", "BinaryOperator", "_", "BinaryOperand"], "postprocess": convertBinaryExpression},
    {"name": "MathFunctionParameter", "symbols": ["NumberLiteral"], "postprocess": id},
    {"name": "MathFunctionParameter", "symbols": ["Variable"], "postprocess": id},
    {"name": "MathFunctionParameter", "symbols": ["MathExpression"], "postprocess": id},
    {"name": "MathFunctionParams", "symbols": ["MathFunctionParameter"], "postprocess": d => [d[0]]},
    {"name": "MathFunctionParams", "symbols": ["MathFunctionParams", "_", {"literal":","}, "_", "MathFunctionParameter"], "postprocess": d => d[0].concat(d[4])},
    {"name": "FunctionCall", "symbols": [{"literal":"sum"}, "_", {"literal":"("}, "_", "MathFunctionParams", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "FunctionCall", "symbols": [{"literal":"average"}, "_", {"literal":"("}, "_", "MathFunctionParams", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "FunctionCall", "symbols": [{"literal":"max"}, "_", {"literal":"("}, "_", "MathFunctionParams", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "FunctionCall", "symbols": [{"literal":"min"}, "_", {"literal":"("}, "_", "MathFunctionParams", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "FunctionCall", "symbols": [{"literal":"abs"}, "_", {"literal":"("}, "_", "MathFunctionParameter", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "FunctionCall", "symbols": [{"literal":"floor"}, "_", {"literal":"("}, "_", "MathFunctionParameter", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "FunctionCall", "symbols": [{"literal":"ceil"}, "_", {"literal":"("}, "_", "MathFunctionParameter", "_", {"literal":")"}], "postprocess": convertFunctionExpression},
    {"name": "MP", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": function(d) { return d[2]; }},
    {"name": "MP", "symbols": ["NumberLiteral"], "postprocess": id},
    {"name": "MP", "symbols": ["Variable"], "postprocess": id},
    {"name": "MP", "symbols": ["FunctionCall"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", "AddSubOperator", "_", "MD"], "postprocess": convertBinaryExpression},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", "MDOperator", "_", "E"], "postprocess": convertBinaryExpression},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "E", "symbols": ["MP", "_", "EXPOperator", "_", "E"], "postprocess": convertBinaryExpression},
    {"name": "E", "symbols": ["MP"], "postprocess": id},
    {"name": "MathExpression", "symbols": ["AS"], "postprocess": id},
    {"name": "BinaryOperand", "symbols": ["NumberLiteral"], "postprocess": id},
    {"name": "BinaryOperand", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "BinaryOperand", "symbols": ["Variable"], "postprocess": id},
    {"name": "BinaryOperand", "symbols": ["BinaryExpression"], "postprocess": id},
    {"name": "BinaryOperand", "symbols": ["MathExpression"], "postprocess": id},
    {"name": "ListOperand", "symbols": ["NumberLiteral"], "postprocess": id},
    {"name": "ListOperand", "symbols": ["StringLiteral"], "postprocess": id},
    {"name": "ListOperand", "symbols": ["Variable"], "postprocess": id},
    {"name": "ParameterList", "symbols": ["ListOperand"], "postprocess": d => [d[0]]},
    {"name": "ParameterList", "symbols": ["ParameterList", "_", {"literal":","}, "_", "ListOperand"], "postprocess": d => d[0].concat(d[4])},
    {"name": "Variable", "symbols": [(lexer.has("Variable") ? {type: "Variable"} : Variable)], "postprocess": convertVariable},
    {"name": "NumberLiteral", "symbols": [{"literal":"-"}, (lexer.has("NumberLiteral") ? {type: "NumberLiteral"} : NumberLiteral)], "postprocess": d => convertSignedNumber('-', d[1])},
    {"name": "NumberLiteral", "symbols": [{"literal":"+"}, (lexer.has("NumberLiteral") ? {type: "NumberLiteral"} : NumberLiteral)], "postprocess": d => convertTokenId([d[1]])},
    {"name": "NumberLiteral", "symbols": [(lexer.has("NumberLiteral") ? {type: "NumberLiteral"} : NumberLiteral)], "postprocess": convertTokenId},
    {"name": "StringLiteral", "symbols": [(lexer.has("StringLiteral") ? {type: "StringLiteral"} : StringLiteral)], "postprocess": convertTokenId},
    {"name": "LogicalOperator", "symbols": [(lexer.has("LogicalOperator") ? {type: "LogicalOperator"} : LogicalOperator)], "postprocess": convertOperator},
    {"name": "CollectionOperator", "symbols": [(lexer.has("CollectionOperator") ? {type: "CollectionOperator"} : CollectionOperator)], "postprocess": convertOperator},
    {"name": "BinaryOperator", "symbols": [(lexer.has("BinaryOperator") ? {type: "BinaryOperator"} : BinaryOperator)], "postprocess": convertOperator},
    {"name": "AddSubOperator", "symbols": [(lexer.has("AddSubOperator") ? {type: "AddSubOperator"} : AddSubOperator)], "postprocess": convertOperator},
    {"name": "MDOperator", "symbols": [(lexer.has("MDOperator") ? {type: "MDOperator"} : MDOperator)], "postprocess": convertOperator},
    {"name": "EXPOperator", "symbols": [(lexer.has("EXPOperator") ? {type: "EXPOperator"} : EXPOperator)], "postprocess": convertOperator},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", (lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null; }}
  ],
  ParserStart: "main",
};

export default grammar;
