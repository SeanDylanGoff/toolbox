import { deepStrictEqual } from 'assert';
import { objToArr } from './objToArr.js';

function test() {
    const mapFn = key => `${key}_mapped`;
    const input = { a: { x: 1 }, b: { x: 2 }, c: { x: 3 } };
    const output = [
        { x: 1, id: 'a' },
        { x: 2, id: 'b' },
        { x: 3, id: 'c' },
    ];
    deepStrictEqual(objToArr(input, 'id'), output);
}

test();
