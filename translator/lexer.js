


const string1 = "1.123 + 0.2 * .3 / ( 450 - 5 ) ^ ( - 6 )";
const expectedOutput = [
    {type: "FLOAT", value: 1.123},
    {type: "BINOP", value: "ADD"},
    {type: "FLOAT", value: 0.2},
    {type: "BINOP", value: "MULTIPLY"},
    {type: "FLOAT", value: 0.3},
    {type: "BINOP", value: "DIVIDE"},
    {type: "LPAREN", value: "("},
    {type: "FLOAT", value: 450.0},
    {type: "BINOP", value: "SUBTRACT"},
    {type: "FLOAT", value: 5.0},
    {type: "RPAREN", value: ")"},
    {type: "BINOP", value: "EXPONENT"},
    {type: "LPAREN", value: "("},
    {type: "UNARYOP", value: "-"},
    {type: "FLOAT", value: 6.0},
    {type: "RPAREN", value: ")"},
]

class Lexer {
    constructor(_expr) {
        this.expr = _expr;
        this.cursor = 0;
    }

    scan(str) {
        //remove whitespace
        return str.replaceAll(/\s/g, "");
    }

    tokenize() {

    }
}

let test = new Lexer;
console.log(test.tokenize());
