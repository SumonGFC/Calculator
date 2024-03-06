


const string1 = "1.123 + 0.2 * .3 / ( 450 - 5 ) ^ ( - 6 )";
const expectedOutput = [
    {type: "NUMBER", value: 1.123},
    {type: "OPERATOR", value: "PLUS"},
    {type: "NUMBER", value: 0.2},
    {type: "OPERATOR", value: "MULTIPLY"},
    {type: "NUMBER", value: 0.3},
    {type: "OPERATOR", value: "DIVIDE"},
    {type: "LPAREN", value: "("},
    {type: "NUMBER", value: 450},
    {type: "OPERATOR", value: "MINUS"},
    {type: "NUMBER", value: 5},
    {type: "RPAREN", value: ")"},
    {type: "OPERATOR", value: "EXPONENT"},
    {type: "LPAREN", value: "("},
    {type: "OPERATOR", value: "MINUS"},
    {type: "NUMBER", value: 6},
    {type: "RPAREN", value: ")"},
    {type: "EOF", value: "EOF"}
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
        const tokens = [];
        while (this.cursor < this.expr.length) {
            
        }
    }
}

let test = new Lexer;
console.log(test.tokenize());
