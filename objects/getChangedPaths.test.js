import { deepStrictEqual } from 'assert';
import { getChangedPaths } from './getChangedPaths.js';

function test() {
    const path = ['components', { a: true, b: true, c: false }, 'config'];
    const pattern = 'components.:x.config.x.:x(y|z)';
    deepStrictEqual(getChangedPaths(path, pattern), [
        ['components', 'a', 'config', 'x', 'y'],
        ['components', 'a', 'config', 'x', 'z'],
        ['components', 'b', 'config', 'x', 'y'],
        ['components', 'b', 'config', 'x', 'z'],
    ]);
}

test();
