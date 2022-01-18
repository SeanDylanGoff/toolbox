import { deepStrictEqual } from 'assert';
import { setMultiple } from './setMultiple.js';

function test() {
    const input = {};
    const output = {
        c: { 2: { xxx: { y: '123' }, yyy: { y: '123' } } },
    };
    setMultiple(input, ['c', 2, { xxx: true, yyy: true }, 'y'], '123');
    deepStrictEqual(input, output);
}

test();
