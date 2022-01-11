import { deepStrictEqual } from 'assert';
import { keepByValues } from './keepByValues.js';

function test() {
    const keepFn = val => val >= 2;
    const input = { a: 1, b: 2, c: 3 };
    const output = { b: 2, c: 3 };
    deepStrictEqual(keepByValues(input, keepFn), output);
}

test();
