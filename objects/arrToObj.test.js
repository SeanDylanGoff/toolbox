import { deepStrictEqual } from 'assert';
import { arrToObj } from './arrToObj.js';

function test() {
    const mapFn = key => `${key}_mapped`;
    const input = [
        { x: 1, id: 'a' },
        { x: 2, id: 'b' },
        { x: 3, id: 'c' },
    ];
    const output = { a: { x: 1 }, b: { x: 2 }, c: { x: 3 } };
    deepStrictEqual(arrToObj(input, 'id'), output);
}

test();
