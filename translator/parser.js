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
    }

    #cursor = 0;
    #EOF = "EOF";

    #next() {
        //return next token
        if (this.tokens[#cursor].type === "EOF") {
            #cursor = 0;
            return #EOF;
        }
        return this.tokens[#cursor];
    }

    #consumeToken(inputToken, tokenType) {
        //read token; verify token is correct type
        if (inputToken.type === tokenType) 
    }
    
    #error() {
        //stop parsing and reports error
    }

    stream(_tokens) {
        this.tokens = _tokens;
    }

    exprRecognizer() {
        //This function scans the stream of tokens
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
testParser.exprRecognizer();
// make AST:
