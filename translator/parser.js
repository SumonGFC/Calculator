const { Lexer } = require("./lexer.js");

class Parser {
    constructor() {
        this.tokens = [];
        this.cursor = 0;
        this.sentinel = "$";    // arbitrary value used to compare precedence
        this.binops = ["+", "-", "*", "/", "^"];
    }
    
    // PRIVATE METHODS

    #mkTokenObj(_tokens) {
        // Convert raw tokens into objects
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
                    break;
                default:
                    throw new Error("Error: Invalid Token")
            }
        }
        return tokenStream;
    }
    
    #nextToken() { return this.tokens[this.cursor]; }

    #consume() { ++this.cursor }

    #expect(_token) {
        if (this.#nextToken().type === _token) { this.#consume(); } 
        else { throw new Error("Error: Unexpected Token"); }
    }

    #head(stack) { return stack[stack.length-1]; }

    #precedence(op) {
        if (op === "^") { return 4; }
        else if (op === "*" || op === "/") { return 3; }
        else if (op === "u") { return 2; }
        else if (op === "+" || op === "-") { return 1; }
        else if (op === "$") { return 0; }
        else { throw new Error(`pushOperator() passed illegal value: ${op}`); }
    }

    #mkLeaf(_token) {
        return { number: _token.value };
    }

    #mkNode(operator, operand1, operand2) {
        if (operand2 === undefined) {
            return {operation: operator, left: operand1};
        }
        return {operation: operator, left: operand1, right: operand2};
    }

    // Implement Productions
    #E(operators, operands) {
        this.#P(operators, operands);

        while (this.#nextToken().type === "BINOP") {
            this.#pushOperator(this.#nextToken().value, operators, operands);
            this.#consume();
            this.#P(operators, operands);
        }

        while (this.#head(operators) !== this.sentinel) {
            this.#popOperator(operators, operands);
        }
    }

    #P(operators, operands) {
        if (this.#nextToken().type === "NUMBER") {
            operands.push(this.#mkLeaf(this.#nextToken()));
            this.#consume();
        } else if (this.#nextToken().type === "LPAREN") {
            this.#consume();
            operators.push(this.sentinel);
            this.#E(operators, operands);
            this.#expect("RPAREN");
            operators.pop(); // remove sentinel
        } else if (this.#nextToken().type === "UNOP") {
            this.#pushOperator(this.#nextToken().value, operators, operands);
            this.#consume();
            this.#P(operators, operands);
        } else {throw new Error(`Error: Invalid token ${this.#nextToken()} read during execution of P()`)}

    }
    
    #popOperator(operators, operands) {
        // Make node (by popping stacks) and push onto operands
        let left;
        let right;
        if (this.binops.includes(this.#head(operators))) {
            right = operands.pop();
            left = operands.pop();
            operands.push(this.#mkNode(operators.pop(), left, right));
        } else {
            operands.push(this.#mkNode(operators.pop(), operands.pop(), undefined));
        }
    }

    #pushOperator(op, operators, operands) {
        // call popOperator while the current operator token has lower 
        // precedence than the token at head(operator stack)
        while (this.#precedence(this.#head(operators)) > this.#precedence(op)) {
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
        return operands;
    }
}

// PROGRAM:

// get token stream:
const test = new Lexer;
const testString = "1 + 2^(3^4 - 5)/6.1 + (1-2^3^4/5)";
const testTokens = test.tokenize(testString);
console.log(testTokens);
// test for syntax errors:
const testParser = new Parser;
testParser.stream(testTokens);
console.log(JSON.stringify(testParser.parse(), null, "     "));
// make AST:
