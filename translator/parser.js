const { Lexer } = require("./lexer.js");

const tokenTypes = {
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

    #next() {
        //return next token
        
    }

    #consumeToken(inputToken, tokenType) {
        //read token; verify token is correct type
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
