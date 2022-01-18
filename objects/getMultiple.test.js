import { deepStrictEqual } from 'assert';
import { getMultiple } from './getMultiple.js';

function test() {
    const input = { a: 1, b: 2, c: [{}, {}, { xxx: { y: '123' } }] };
    const output1 = ['123'];
    const output2 = [1, 2];
    deepStrictEqual(getMultiple(input, 'c.2.xxx.y'), output1);
    deepStrictEqual(
        getMultiple(input, [{ a: true, b: true, c: false }]),
        output2
    );
}

test();
