/* Mathematical Expression Lexical Analyzer
 * Currently, this lexer only recognizes the symbols in the set:
 * [ 0123456789.+-/*^() ]
 */

class Lexer {
    constructor() {
    }
    
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

        const tokens = [];
        let numBuilder = "";

        while (this.#cursor < this.#expr.length) {
            switch(true) {
                case this.#at() === "+":
                    tokens.push({type: "OPERATOR", value: "PLUS"});
                    break;
                case this.#at() === "-":
                    tokens.push({type: "OPERATOR", value: "MINUS"});
                    break;
                case this.#at() === "/":
                    tokens.push({type: "OPERATOR", value: "DIVIDE"});
                    break;
                case this.#at() === "*":
                    tokens.push({type: "OPERATOR", value: "MULTIPLY"});
                    break;
                case this.#at() === "^":
                    tokens.push({type: "OPERATOR", value: "EXPONENT"});
                    break;
                case this.#at() === "(":
                    tokens.push({type: "PUNC", value: "LPAREN"});
                    break;
                case this.#at() === ")":
                    tokens.push({type: "PUNC", value: "RPAREN"});
                    break;
                case !isNaN(this.#at()) || this.#at() === ".":
                    do {
                        numBuilder += this.#at();
                        ++this.#cursor;
                    } while (!isNaN(this.#at()) || this.#at() === ".");

                    if (!(this.#matchNumber(numBuilder))) {
                        throw new Error(`Syntax Error: Invalid Number Representation ${numBuilder}`);
                    } else {
                        tokens.push({type: "NUMBER", value: parseFloat(numBuilder)});
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
        tokens.push({type: "EOF", value: "EOF"})
        return tokens;
    }
}



const string1 = "1.123 + 0.2 * .3 / ( 450 - 5 ) ^ ( - 6 )";
const expectedOutput1 = [
    {type: "NUMBER", value: 1.123},
    {type: "OPERATOR", value: "PLUS"},
    {type: "NUMBER", value: 0.2},
    {type: "OPERATOR", value: "MULTIPLY"},
    {type: "NUMBER", value: 0.3},
    {type: "OPERATOR", value: "DIVIDE"},
    {type: "PUNC", value: "LPAREN"},
    {type: "NUMBER", value: 450},
    {type: "OPERATOR", value: "MINUS"},
    {type: "NUMBER", value: 5},
    {type: "PUNC", value: "RPAREN"},
    {type: "OPERATOR", value: "EXPONENT"},
    {type: "PUNC", value: "LPAREN"},
    {type: "OPERATOR", value: "MINUS"},
    {type: "NUMBER", value: 6},
    {type: "PUNC", value: "RPAREN"},
    {type: "EOF", value: "EOF"}
]


const string2 = "1.1.1"
let test = new Lexer;
console.log(test.tokenize(string2));
