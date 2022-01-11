import { deepStrictEqual } from 'assert';
import { keepByKeys } from './keepByKeys.js';

function test() {
    const keepFn = key => ['a', 'c'].includes(key);
    const input = { a: 1, b: 2, c: 3 };
    const output = { a: 1, c: 3 };
    deepStrictEqual(keepByKeys(input, keepFn), output);
}

test();
