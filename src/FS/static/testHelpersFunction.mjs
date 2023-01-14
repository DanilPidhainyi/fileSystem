import {splitArr} from "./helpers.mjs";


const test = (expression, answer) => {
    if (
        expression.toString() === answer.toString()
    ) {
        console.log('\x1b[42m', 'true' ,'\x1b[0m');
    } else {
        console.log('\x1b[41m', `${expression} !== ${answer}`, '\x1b[0m')
    }
}


test(
    splitArr([1, 2, 3, 4, 5], 2),
    [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]
)

