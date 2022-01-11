import { deepStrictEqual } from 'assert';
import { get } from './get.js';

function test() {
    const input = { a: 1, b: 2, c: [{}, {}, { xxx: { y: '123' } }] };
    const output = '123';
    deepStrictEqual(get(input, 'c.2.xxx.y'), output);
}

test();
