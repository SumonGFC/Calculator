class Evaluator {
    constructor() {
        this.validExpr = true;
        this.errorMessage = "";
    }

    #traverse(subTree) {
        if (!isNaN(subTree.leaf)) {
            return subTree.leaf;
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
                        this.validExpr = false;
                        throw new Error("Couldn't evaluate exponentiation");
                    } else {
                        return tmp;
                    }
                case "u":
                    return (-1)*(left);
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

module.exports = { Evaluator };
