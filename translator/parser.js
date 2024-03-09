const { Lexer } = require("./lexer.js");

const _tokenTypes = {
    plus: "PLUS",
    minus: "MINUS",
    divide: "DIVIDE",
    multiply: "MULTIPLY",
    exponent: "EXPONENT",
    lParen: "LPAREN",
    rParen: "RPAREN",
    number: "NUMBER",
    eof: "EOF"
}

class Parser {
    constructor() {
        this.tokens = [];
        this.cursor = 0;
        this.sentinel = "$";
    }
    
    // Helpers
    #mkTokenObj(_tokens) {
        let tokenStream = []
        for (let i = 0; i < _tokens.length; ++i) {
            switch(true) {
                case _tokens[i] === "+":
                case _tokens[i] === "*":
                case _tokens[i] === "/":
                case _tokens[i] === "^":
                    tokenStream.push({ type: "BINOP", value: _tokens[i] });
                    break;
                case _tokens[i] === "(":
                    tokenStream.push({ type: "LPAREN", value: _tokens[i] });
                    break;
                case _tokens[i] === ")":
                    tokenStream.push({ type: "RPAREN", value: _tokens[i] });
                    break;
                case !isNaN(_tokens[i]):
                    tokenStream.push({ type: "NUMBER", value: _tokens[i] });
                    break;
                case _tokens[i] === "-":
                    if (_tokens[i-1] === ")" || !isNaN(_tokens[i-1])) {
                        tokenStream.push({type: "BINOP", value: _tokens[i]})
                    } else {
                        tokenStream.push({type: "UNOP", value: _tokens[i]})
                    }
                    break;
                case _tokens[i] === "EOF":
                    tokenStream.push({type: "EOF", value: "EOF"});
                default:
                    throw new Error("Error: Invalid Token")
            }
        }
        return tokenStream;
    }

    #nextToken() { return this.tokens[this.cursor]; }

    #consume() { ++this.cursor }

    #expect(_token) {
        if (this.#nextToken().type === _token.type) {
            this.#consume();
        } else {
            throw new Error("Error: Unexpected Token");
        }
    }
    
    // Implement Productions
    #E(operators, operands) {
        this.#P(operators, operands);

        while (this.#nextToken().type === "BINOP") {
            this.#pushOperator(this.#binary(this.#nextToken()), operators, operands);
            this.#consume();
            this.#P(operators, operands);
        }

        while (this.#head(operators) !== this.sentinel) {
            popOperator(operators, operands);
        }
    }

    // Methods
    stream(_tokens) {
        this.tokens = _tokens;
        this.cursor = 0;
    }

    parse() {
        let operators = [];
        let operands = [];
        operators.push(this.sentinel);
        this.#E(operators, operands);
        this.#expect("EOF");
    }
}

// PROGRAM:

// get token stream:
const test = new Lexer;
const testString = "1.1";
const testTokens = test.tokenize(testString);
// test for syntax errors:
const testParser = new Parser;
testParser.stream(testTokens);
testParser.parse();
// make AST:
