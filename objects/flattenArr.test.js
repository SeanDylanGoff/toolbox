import { deepStrictEqual } from 'assert';
import { flattenArr } from './flattenArr.js';

function test() {
    const mapFn = key => `${key}_mapped`;
    const input = [1, 2, [3, [4, 5], 6], 7];
    const output = [1, 2, 3, 4, 5, 6, 7];
    deepStrictEqual(flattenArr(input, mapFn), output);
}

test();
