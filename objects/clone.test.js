import { deepStrictEqual } from 'assert';
import { clone } from './clone.js';

function test() {
    const input = { a: 1, b: 2, c: 3, d: [1, 2, 3] };
    deepStrictEqual(clone(input), input);
}

test();
