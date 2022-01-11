import { deepStrictEqual } from 'assert';
import { mapKeys } from './mapKeys.js';

function test() {
    const mapFn = key => `${key}_mapped`;
    const input = { a: 1, b: 2, c: 3 };
    const output = { a_mapped: 1, b_mapped: 2, c_mapped: 3 };
    deepStrictEqual(mapKeys(input, mapFn), output);
}

test();
