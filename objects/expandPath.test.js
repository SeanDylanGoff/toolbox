import { deepStrictEqual } from 'assert';
import { expandPath } from './expandPath.js';

function test() {
    const mapFn = key => `${key}_mapped`;
    const input = ['a', 'b', { x: true, y: true, z: false }, 'c'];
    const output = [
        ['a', 'b', 'x', 'c'],
        ['a', 'b', 'y', 'c'],
    ];
    deepStrictEqual(expandPath(input, mapFn), output);
}

test();
