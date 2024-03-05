


const string1 = "1 + 2 * 3 / ( 4 - 5 ) ^ - 6";

function scan(str) {
    //remove whitespace
    return str.replaceAll(/\s/g, "");
}


function test() {
    console.log(scan(string1));
}

test();
