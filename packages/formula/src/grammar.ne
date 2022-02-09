@preprocessor typescript
@{%
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
%}

# Pass your lexer with @lexer:
@lexer lexer

# Operator precedence, from lowest to highest
# ||
# &&
# ∈/∉
# <=/</>=/>/==/!=
# * / %
# + -

main -> LogicalExpression {% id %}

LogicalExpression
  -> LogicalExpression _ "||" _ LogicalExpression {% convertLogicalExpression %}
   | LogicalExpression _ "&&" _ LogicalExpression {% convertLogicalExpression %}
   | CollectionExpression {% id %}
   | BinaryExpression {% id %}
   | MathExpression {% id %}
   | P {% id %}

P -> "(" _ LogicalExpression _ ")" {% (d) => d[2] %}
   | "(" _ BinaryExpression _ ")" {% (d) => d[2] %}

CollectionExpression
  -> ListOperand _ CollectionOperator _ "{" _ ParameterList _ "}"
     {%
       (d) => ({
         type: 'CollectionExpression',
         left: d[0],
         operator: d[2],
         right: d[6]
       })
     %}

BinaryExpression
  -> BinaryOperand _ BinaryOperator _ BinaryOperand {% convertBinaryExpression %}

MathFunctionParameter
  -> NumberLiteral {% id %}
   | Variable {% id %}
   | MathExpression {% id %}

MathFunctionParams
  -> MathFunctionParameter   {% d => [d[0]] %}
   | MathFunctionParams _ "," _ MathFunctionParameter {% d => d[0].concat(d[4]) %}

FunctionCall
  -> "sum" _ "(" _ MathFunctionParams _ ")" {% convertFunctionExpression %}
   | "average" _ "(" _ MathFunctionParams _ ")" {% convertFunctionExpression %}
   | "max" _ "(" _ MathFunctionParams _ ")" {% convertFunctionExpression %}
   | "min" _ "(" _ MathFunctionParams _ ")" {% convertFunctionExpression %}
   | "abs" _ "(" _ MathFunctionParameter _ ")" {% convertFunctionExpression %}
   | "floor" _ "(" _ MathFunctionParameter _ ")" {% convertFunctionExpression %}
   | "ceil" _ "(" _ MathFunctionParameter _ ")" {% convertFunctionExpression %}

# Math Parentheses
MP -> "(" _ AS _ ")" {% function(d) { return d[2]; } %}
    | NumberLiteral  {% id %}
    | Variable  {% id %}
    | FunctionCall {% id %}

# Addition and subtraction
AS -> AS _ AddSubOperator _ MD {% convertBinaryExpression %}
    | MD            {% id %}

# Multiplication and division
MD -> MD _ MDOperator _ E  {% convertBinaryExpression %}
    | E             {% id %}

# Exponents
E -> MP _ EXPOperator _ E    {% convertBinaryExpression %}
    | MP             {% id %}

MathExpression -> AS {% id %}

BinaryOperand -> NumberLiteral {% id %}
  | StringLiteral {% id %}
  | Variable {% id %}
  | BinaryExpression {% id %}
  | MathExpression {% id %}

ListOperand -> NumberLiteral {% id %}
  | StringLiteral {% id %}
  | Variable {% id %}

ParameterList
  -> ListOperand   {% d => [d[0]] %}
   | ParameterList _ "," _ ListOperand {% d => d[0].concat(d[4]) %}

Variable -> %Variable {% convertVariable %}

NumberLiteral
  -> "-" %NumberLiteral {% d => convertSignedNumber('-', d[1]) %}
   | "+" %NumberLiteral {% d => convertTokenId([d[1]]) %}
   | %NumberLiteral {% convertTokenId %}

StringLiteral -> %StringLiteral {% convertTokenId %}

LogicalOperator -> %LogicalOperator {% convertOperator %}

CollectionOperator -> %CollectionOperator {% convertOperator %}

BinaryOperator -> %BinaryOperator {% convertOperator %}

AddSubOperator -> %AddSubOperator {% convertOperator %}

MDOperator -> %MDOperator {% convertOperator %}

EXPOperator -> %EXPOperator {% convertOperator %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> %ws:* {% function(d) {return null; } %}
