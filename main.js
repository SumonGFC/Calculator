// CLASSES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
class Lexer {
    constructor() {}
 
    // ERROR REPORTING

    // match correct number representation (for reference)
    //#regexNum = /(\d+|\d*\.\d+)/;
    // match invalid consecutive operators
    #consecutiveOps = /[+*/^-][+*/^][+*/^-]*/;
    // match operator "inside" parenthsis e.g. "(+" or "^)"
    #opInParen = /(\([+*/^]|[+*/^-]\))/; 
    // match shorthand multiplication e.g. 1( or )1 or )(
    #shorthandMultiply = /((\d+|\d*\.\d+)\(|\)(\d+|\d*\.\d+)|\)\()/; 
    // match empty parentheses
    #emptyParens = /\(\)/;
    // determine unbalanced parentheses
    #unbalancedParens(expr) {
        let stack = [];
        for (let i = 0; i < expr.length; ++i) {
            if (expr[i] === "(" || expr[i] === ")") {
                stack.push(expr[i]);
                if (stack[stack.length - 1] === ")") {
                    if (stack[stack.length - 2] === "(") {
                        stack.pop();
                        stack.pop();
                    }
                }
            }
        }
        return stack.length !== 0;
    }

    #reportError(expr) {
        if (this.#consecutiveOps.test(expr)) {
            return "SyntaxError: Consecutive Operators. Maybe you forgot some numbers?";
        }

        if (this.#opInParen.test(expr)) {
            return "SyntaxError: Missing Operand in Parentheses. Maybe you forgot some numbers?";
        }

        if (this.#shorthandMultiply.test(expr)) {
            return "SyntaxError: Programmer Skill Issue. Need operator between parentheses or between number and parenthesis. Shorthand multiplication unsupported."
        }

        if (this.#unbalancedParens(expr)) {
            return "SyntaxError: Unbalanced Parentheses."
        }

        if (this.#emptyParens.test(expr)) {
            return "SyntaxError: Empty Parentheses.";
        }

        return false;
    }

    // HELPER FUNCTIONS & CLASS FIELDS
    #expr = "";
    #cursor = 0;
 
    #at() { return this.#expr[this.#cursor]; }

    #matchNumber(str) {
        // I did this before I decided to handle errors in the lexer. 
        const regexInt = /^\d+$/; 
        const regexFloat = /^\d*\.\d+$/;
        return regexInt.test(str) || regexFloat.test(str);
    }

    // TOKENIZER
    tokenize(expr) {
        this.#expr = expr.replaceAll(/\s/g, "");

        const error = this.#reportError(this.#expr);
        if (error) { return error; }

        this.#cursor = 0;
        const _tokens = [];
        let numBuilder = "";

        while (this.#cursor < this.#expr.length) {
            switch(true) {
                case this.#at() === "+":
                    _tokens.push("+");
                    break;
                case this.#at() === "-":
                    _tokens.push("-");
                    break;
                case this.#at() === "/":
                    _tokens.push("/");
                    break;
                case this.#at() === "*":
                    _tokens.push("*");
                    break;
                case this.#at() === "^":
                    _tokens.push("^");
                    break;
                case this.#at() === "(":
                    _tokens.push("(");
                    break;
                case this.#at() === ")":
                    _tokens.push(")");
                    break;
                case !isNaN(this.#at()) || this.#at() === ".":
                    do {
                        numBuilder += this.#at();
                        ++this.#cursor;
                    } while (!isNaN(this.#at()) || this.#at() === ".");
                    // INVALID NUMBER REPRESENTATIONS HANDLED HERE
                    if (!(this.#matchNumber(numBuilder))) {
                        return `SyntaxError: Invalid Number Representation ${numBuilder}`;
                    } else {
                        _tokens.push(parseFloat(numBuilder));
                        numBuilder = "";
                        this.#cursor--;
                    }
                    break;
                default:
                    return `SyntaxError: Encountered invalid token "${this.#at()}" at index ${this.#cursor}.`
            }
            this.#cursor++;
        }
        _tokens.push("EOF");
        return _tokens;
    }
}

class Parser {
    constructor() {
        this.tokens = [];
        this.cursor = 0;
        this.sentinel = "$";    // arbitrary value used to compare op precedence
        this.binops = ["+", "-", "*", "/", "^"];
        this.lAssociatives = ["+", "-", "*", "/"];
    }
    
    // PRIVATE METHODS

    #stream(_tokens) {
        this.tokens = this.#mkTokenObj(_tokens);
        console.log("Token Stream: ", this.tokens);
        this.cursor = 0;
    }

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
                    throw new Error("Error: Invalid Token");
            }
        }
        return tokenStream;
    }
    
    #nextToken() { return this.tokens[this.cursor]; }

    #consume() { ++this.cursor }

    #expect(_token) {
        if (this.#nextToken().type === _token) { this.#consume(); } 
        else { throw new Error("Error: Encountered Unexpected Token"); }
    }

    #head(stack) { return stack[stack.length-1]; }

    #precedence(op) {
        if (op === "u") { return 4; }
        else if (op === "^") { return 3; }
        else if (op === "*" || op === "/") { return 2; }
        else if (op === "+" || op === "-") { return 1; }
        else if (op === "$") { return 0; }
        else { throw new Error(`pushOperator() passed illegal value: ${op}`); }
    }

    #mkLeaf(_token) {
        return { leaf: _token.value }
    }

    #mkNode(operator, operand1, operand2) {
        if (operand2 === undefined) {
            return { operation: operator, left: operand1 };
        }
        return { operation: operator, left: operand1, right: operand2 };
    }

    // Implement Productions (Shunting Yard Algorithm)
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
        // Make node (by popping op stacks) and push onto operands
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
        while (this.#precedence(this.#head(operators)) > this.#precedence(op)
        || (this.#precedence(this.#head(operators)) === this.#precedence(op)
        && (this.lAssociatives.includes(this.#head(operators))))) {
            this.#popOperator(operators, operands);
        }
        operators.push(op);
    }

    // PUBLIC METHODS

    parse(_tokens) {
        this.#stream(_tokens);
        let operators = [];
        let operands = [];
        operators.push(this.sentinel);
        this.#E(operators, operands);
        this.#expect("EOF");
        return operands;
    }
}

class Evaluator {
    constructor() {
        this.validExpr = true;
        this.errorMessage = "";
    }

    #traverse(subTree) {
        if (!isNaN(subTree.leaf)) {
            return subTree.leaf;
        } else if (subTree.operation === "u") {
            return (-1)*this.#traverse(subTree.left);
        } else {
            const left = this.#traverse(subTree.left);
            const right = this.#traverse(subTree.right);
            switch(subTree.operation) {
                case "+":
                    return left + right;
                case "-":
                    return left - right;
                case "*":
                    return left*right;
                case "/":
                    if (right !== 0 ) {
                        return left/right;
                    } else {
                        this.errorMessage = "Division by 0 is unsupported.";
                        this.validExpr = false;
                        throw new Error("Divide by 0");
                    }
                case "^":
                    const tmp = left**right;
                    if (isNaN(tmp)) {
                        this.errorMessage = "Error: It seems we could not " +
                        "evaluate exponentiation. Complex number arithmetic " +
                        "is unsupported at this time.";
                        alert(this.errorMessage);
                        this.validExpr = false;
                        throw new Error("Couldn't evaluate exponentiation");
                    } else {
                        return tmp;
                    }
                default:
                    throw new Error("Error: Invalid operator in AST.")
            }
        }
    }

    evaluate(AST) {
        const result = this.#traverse(AST);
        if (this.validExpr) {
            return result;
        } else {
            const msg = this.errorMessage;
            this.errorMessage = "";
            this.validExpr = true;
            return msg;
        }
    }
}

// PAGE LOGIC~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const lexer = new Lexer;
const parser = new Parser;
const evaluator = new Evaluator;
// const str = "45-3+2*6^-1";

// const tokens = lexer.tokenize(str);
// const ast = parser.parse(tokens);
// const result = evaluator.evaluate(ast[0]);
// console.log(result);
function eval(expr) {
    const tokens = lexer.tokenize(expr);
    if (typeof tokens === "string") {
        return tokens;
    } else if (typeof tokens !== "object") {
        return tokens;
    } else {
        const AST = parser.parse(tokens);
        console.log("AST:", AST);
        const result = evaluator.evaluate(AST[0]);
        if (typeof result === "string") { return result; }
        else {return result[0];}
    }
}

// buttons
const symButtons = document.querySelectorAll(".sym-input");
const ansButton = document.querySelector("#ans");
const eqlButton = document.querySelector("#equals");
const delButton = document.querySelector("#del");
const clearButton = document.querySelector("#clear");
// display divs
const exprDisplay = document.querySelector("#expr-display");
const historyDisplay = document.querySelector("#history-display");

// global state
let _exprBuilder = "";

// event listeners
for (let i = 0; i < symButtons.length; ++i) {
    symButtons[i].addEventListener("click", () => {
        if (symButtons[i].textContent === "x^y"
        || symButtons[i].textContent === "ans") {
            exprDisplay.textContent += symButtons[i].value;
        } else {
            exprDisplay.textContent += symButtons[i].textContent;
        }
        _exprBuilder += symButtons[i].value;
    });
}

eqlButton.addEventListener("click", () => {
    console.log(`_exprBuilder: ${_exprBuilder}`);
    const result = eval(_exprBuilder);
    if (typeof result === "string") {
        alert(result);
        return;
    } else {
        // create divs
        const resultContainer = document.createElement("div");
        const exprDiv = document.createElement("div");
        const ansDiv = document.createElement("div");
        // assign content
        exprDiv.textContent = exprDisplay.textContent;
        ansDiv.textContent = `= ${result}`;
        // append divs
        resultContainer.appendChild(exprDiv);
        resultContainer.appendChild(ansDiv);
        historyDisplay.prepend(resultContainer);
        // reset state
        _exprBuilder = "";
        ansButton.value = result;
        exprDisplay.textContent = "";
    }
});

clearButton.addEventListener("click", () => {
    exprDisplay.textContent = "";
    _exprBuilder = "";
});

delButton.addEventListener("click", () => {
    exprDisplay.textContent = exprDisplay.textContent.slice(0, -1);
    _exprBuilder = _exprBuilder.slice(0, -1);
});
