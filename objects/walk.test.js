import { deepStrictEqual } from 'assert';
import { walk } from './walk.js';

function test() {
    const input = {
        a: [1, 2, 3, 4],
        b: { a: 1, b: 2, c: 3 },
        c: { d: { e: true } },
    };
    const expected = [
        { value: [1, 2, 3, 4], path: ['a'] },
        { value: 1, path: ['a', 0] },
        { value: 2, path: ['a', 1] },
        { value: 3, path: ['a', 2] },
        { value: 4, path: ['a', 3] },
        { value: { a: 1, b: 2, c: 3 }, path: ['b'] },
        { value: 1, path: ['b', 'a'] },
        { value: 2, path: ['b', 'b'] },
        { value: 3, path: ['b', 'c'] },
        { value: { d: { e: true } }, path: ['c'] },
        { value: { e: true }, path: ['c', 'd'] },
    ];
    const output = [];
    walk(input, (value, path) => {
        output.push({ value, path });
        if (path.join('.') === 'c.d') {
            return false;
        }
    });
    deepStrictEqual(output, expected);
}

test();
