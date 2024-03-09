const { Lexer } = require("./lexer.js");

class Parser {
    constructor() {
        this.tokens = [];
        this.cursor = 0;
        this.sentinel = "$";
    }
    
    // PRIVATE FIELDS

    // Convert raw tokens into objects
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
                        tokenStream.push({type: "UNOP", value: "u"})
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
    
    // Helpers

    #nextToken() { return this.tokens[this.cursor]; }

    #consume() { ++this.cursor }

    #expect(_token) {
        if (this.#nextToken().type === _token.type) {
            this.#consume();
        } else {
            throw new Error("Error: Unexpected Token");
        }
    }

    #head(stack) {
        return stack[stack.length-1];
    }

    #precedence(op) {
        if (op === "^") { return 3; }
        else if (op === "*" || op === "/") { return 2; }
        else if (op === "u") { return 1; }
        else if (op === "+" || op === "-") { return 0; }
        else { throw new Error(`pushOperator() passed illegal value: ${op}` }
    }

    #mkLeaf() {}

    #mkNode() {}



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

    #popOperator(operators, operands) {
        // Make node (by popping stacks) and push onto operands
        if (this.#head(operators).type === "BINOP") {
            operands.push(
                this.#mkNode(operators.pop(), operands.pop(), operands.pop())
            );
        } else {
            operands.push(this.#mkNode(operators.pop(), operands.pop()));
        }
    }

    #pushOperator(op, operators, operands) {
        // call popOperator while the current operator token has lower 
        // precedence than head(operator-stack)
        while (this.#precedence(this.#head(operators).value) > this.#precedence(op.value)) {
            this.#popOperator(operators, operands);
        }
        operators.push(op);
    }
    // PUBLIC METHODS
    stream(_tokens) {
        this.tokens = this.#mkTokenObj(_tokens);
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
