/* Mathematical Expression Lexical Analyzer
 * Currently, this lexer only recognizes the symbols in the set:
 * [ 0123456789.+-/*^() ]
 *
 * NOTE: I decided to handle errors in the lexer.
 * Because the expressions I will allow the user to generate are relatively 
 * simple (unless I decide to add more features), I thought it better to be
 * lazy for the sake of expediency.
 */

class Lexer {
    constructor() {}
    
    // ERROR REPORTING
    //#regexNum = /(\d+|\d*.\d+)/;  //matches correct number representation
    #consecutiveOps = /[+\*/^-][+\*/^][+\*/^-]*/;  //matches invalid consecutive operators-- CONSECUTIVE MINUS SIGNS ALLOWED
    #opInParen = /(\([+\*/^]|[+\*/^-]\))/;  //matches error: operator "inside" parenthsis e.g. "(+" or "^)"
    #shorthandMultiply = /((\d+|\d*.\d+)\(|\)(\d+|\d*.\d+)|\)\()/; // e.g. 1( or )1 or )(

    #unbalancedParens(expr) {
        let lParens = 0;
        let rParens = 0;
        for (let i = 0; i < expr.length; ++i) {
            if (expr[i] === "(") { ++lParens; }
            if (expr[i] === ")") { ++rParens; }
        }
        return lParens !== rParens;
    }

    #reportError(expr) {
        if (this.#consecutiveOps.test(expr)) {
            return "Syntax Error: Consecutive Operators. Maybe you forgot some numbers?";
        } else if (this.#opInParen.test(expr)) {
            return "Syntax Error: Missing Operand in Parentheses. Maybe you forgot some numbers?";
        } else if (this.#shorthandMultiply.test(expr)) {
            return "Syntax Error: Programmer Skill Issue. Need operator between parentheses or between number and parenthesis. Shorthand multiplication unsupported."
        } else if (this.#unbalancedParens(expr)) {
            return "Syntax Error: Unbalanced Parentheses."
        } else {
            return false;
        }
    }

    // HELPER FUNCTIONS
    #expr = "";
    #cursor = 0;
    
    #at() { return this.#expr[this.#cursor]; }

    #matchNumber(str) {
        // I did this before I decided to handle errors in the lexer. 
        // Once again, laziness trumps responsible design.
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
                    _tokens.push({type: "OPERATOR", value: "PLUS"});
                    break;
                case this.#at() === "-":
                    _tokens.push({type: "OPERATOR", value: "MINUS"});
                    break;
                case this.#at() === "/":
                    _tokens.push({type: "OPERATOR", value: "DIVIDE"});
                    break;
                case this.#at() === "*":
                    _tokens.push({type: "OPERATOR", value: "MULTIPLY"});
                    break;
                case this.#at() === "^":
                    _tokens.push({type: "OPERATOR", value: "EXPONENT"});
                    break;
                case this.#at() === "(":
                    _tokens.push({type: "PUNC", value: "LPAREN"});
                    break;
                case this.#at() === ")":
                    _tokens.push({type: "PUNC", value: "RPAREN"});
                    break;
                case !isNaN(this.#at()) || this.#at() === ".":
                    // INVALID NUMBER REPRESENTATIONS HANDLED HERE
                    do {
                        numBuilder += this.#at();
                        ++this.#cursor;
                    } while (!isNaN(this.#at()) || this.#at() === ".");

                    if (!(this.#matchNumber(numBuilder))) {
                        return `Syntax Error: Invalid Number Representation ${numBuilder}`;
                    } else {
                        _tokens.push({type: "NUMBER", value: parseFloat(numBuilder)});
                        numBuilder = "";
                        this.#cursor--;
                    }
                    break;
                default:
                    return `Encountered invalid token "${this.#at()}" at index ${this.#cursor}.`
            }
            this.#cursor++;
        }
        _tokens.push({type: "EOF", value: "EOF"})
        return _tokens;
    }
}


const test = new Lexer;
const validString = "1 + 2 - 3 * (4/5^6)";
const consOp = "1 +/ 2";
const unP = "1 + (2*3";
const shortM = "1(2)";
const missingOP = "1+(*3)";
const invalidTok = "1+2#3";

console.log(test.tokenize(validString));
console.log(test.tokenize(consOp));
console.log(test.tokenize(unP));
console.log(test.tokenize(shortM));
console.log(test.tokenize(missingOP));
console.log(test.tokenize(invalidTok));

module.exports = { Lexer };
