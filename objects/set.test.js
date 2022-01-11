import { deepStrictEqual } from 'assert';
import { set } from './set.js';

function test() {
    const input = {};
    const output = {
        c: { 2: { xxx: { y: '123' } } },
    };
    set(input, 'c.2.xxx.y', '123');
    deepStrictEqual(input, output);
}

test();
