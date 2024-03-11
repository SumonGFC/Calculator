
/* TODO: Make sure to change the code to accomodate errors in the actual
 * calculator -- i.e. handle error message properly so we can pass the error
 * message for invalid exponentiation to the calculator html.
 */

class Evaluator {
    constructor() {
        this.errorMessage = "";
    }

    evaluate(subTree) {
        if (!isNaN(subTree.leaf)) {
            return subTree.leaf;
        } else {
            switch(subTree.operation) {
                case "+":
                    return this.evaluate(subTree.left) + this.evaluate(subTree.right);
                case "-":
                    return this.evaluate(subTree.left) - this.evaluate(subTree.right);
                case "*":
                    return this.evaluate(subTree.left) * this.evaluate(subTree.right);
                case "/":
                    return this.evaluate(subTree.left) / this.evaluate(subTree.right);
                case "^":
                    const left = this.evaluate(subTree.left);
                    const right = this.evaluate(subTree.right);
                    const tmp = left**right;
                    if (isNaN(tmp)) {
                        this.errorMessage += "Error: It seems we could not " +
                        " evaluate an exponent. Complex number arithmetic is " +
                        "unsupported at this time.\n";
                        throw new Error("Couldn't evaluate exponentiation");
                    } else {
                        return tmp;
                    }
                case "u":
                    return (-1)*(this.evaluate(subTree.left));
                default:
                    throw new Error("Error: Invalid operator in AST.")
            }
        }
    }
}

module.exports = { Evaluator };
