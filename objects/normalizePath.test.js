import { deepStrictEqual } from 'assert';
import { normalizePath } from './normalizePath.js';

function test() {
    const mapFn = key => key * 100;
    const input = ['a.b.c', ['d.e', 'f'], 'g'];
    const output = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    deepStrictEqual(normalizePath(input, mapFn), output);
}

test();
