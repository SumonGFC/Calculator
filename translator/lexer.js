/* Mathematical Expression Lexical Analyzer
 * Currently, this lexer only recognizes the symbols in the set:
 * [ 0123456789.+-/*^() ]
 *
 * NOTE: I decided to handle errors in the lexer instead of the parser.
 * Because the expressions I will allow the user to generate are relatively 
 * simple (unless I decide to add more features), I thought it better to be
 * lazy for the sake of expediency.
 */

class Lexer {
    constructor() {}
    
    // ERROR REPORTING

    // match correct number representation (for reference)
    //#regexNum = /(\d+|\d*.\d+)/;
    // match invalid consecutive operators
    #consecutiveOps = /[+*/^-][+*/^][+*/^-]*/;
    // match operator "inside" parenthsis e.g. "(+" or "^)"
    #opInParen = /(\([+*/^]|[+*/^-]\))/;  
    // match shorthand multiplication e.g. 1( or )1 or )(
    #shorthandMultiply = /((\d+|\d*.\d+)\(|\)(\d+|\d*.\d+)|\)\()/; 
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
        const regexFloat = /^\d*.\d+$/;
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


// const test = new Lexer;
// const validString = "-----1.10001 + 0000.20 - --3 * (4/5^6)";
// const consOp = "1 +/ 2";
// const unP = "1 + (2*3";
// const shortM = "1(2)";
// const missingOP = "1+(*3)";
// const invalidTok = "1+2#3";

// console.log(test.tokenize(validString));
// console.log(test.tokenize(consOp));
// console.log(test.tokenize(unP));
// console.log(test.tokenize(shortM));
// console.log(test.tokenize(missingOP));
// console.log(test.tokenize(invalidTok));

module.exports = { Lexer };
