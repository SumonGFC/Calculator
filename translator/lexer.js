/* Mathematical Expression Lexical Analyzer
 * Currently, this lexer only recognizes the symbols in the set:
 * [ 0123456789.+-/*^() ]
 */

class Lexer {
    constructor() {}
    
    #expr = "";
    #cursor = 0;

    #at() {
        return this.#expr[this.#cursor];
    }

    #matchNumber(str) {
        const regexInt = /^\d+$/; 
        const regexFloat = /^\d*.\d+$/;
        return regexInt.test(str) || regexFloat.test(str);
    }

    tokenize(expr) {
        this.#expr = expr.replaceAll(/\s/g, "");
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
                    do {
                        numBuilder += this.#at();
                        ++this.#cursor;
                    } while (!isNaN(this.#at()) || this.#at() === ".");

                    if (!(this.#matchNumber(numBuilder))) {
                        console.log(`Syntax Error: Invalid Number Representation ${numBuilder}`);
                        return undefined;
                    } else {
                        _tokens.push({type: "NUMBER", value: parseFloat(numBuilder)});
                        numBuilder = "";
                        this.#cursor--;
                    }
                    break;
                default:
                    throw new Error(
                        `Encountered invalid token "${this.#at()}" at index ${this.#cursor}.`
                    );
            }
            this.#cursor++;
        }
        _tokens.push({type: "EOF", value: "EOF"})
        return _tokens;
    }
}

module.exports = { Lexer };
