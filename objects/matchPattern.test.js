import { deepStrictEqual } from 'assert';
import { matchPattern } from './matchPattern.js';

function test() {
    deepStrictEqual(
        matchPattern('components.a.name.b', 'components.:x.name.:y(a|b)'),
        { x: 'a', y: 'b' }
    );
}

test();
