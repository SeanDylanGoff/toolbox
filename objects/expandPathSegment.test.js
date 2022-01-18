import { deepStrictEqual } from 'assert';
import { expandPathSegment } from './expandPathSegment.js';

function test() {
    const mapFn = key => `${key}_mapped`;
    const input = { x: true, y: true, z: false };
    const output = ['x', 'y'];
    deepStrictEqual(expandPathSegment(input, mapFn), output);
}

test();
