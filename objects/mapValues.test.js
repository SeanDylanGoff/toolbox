import { deepStrictEqual } from 'assert';
import { mapValues } from './mapValues.js';

function test() {
    const mapFn = key => key * 100;
    const input = { a: 1, b: 2, c: 3 };
    const output = { a: 100, b: 200, c: 300 };
    deepStrictEqual(mapValues(input, mapFn), output);
}

test();
