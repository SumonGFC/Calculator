function cleanStr(str) {
    //strip str of all whitespace
    return str.replaceAll(/\s/g, "");
}

function tokenizeChar(type, val, input, current) {
    //tokenize single char
    if (type === input[current]) {
        return [1, {type, val}];
    }
    return [0, null];
}
