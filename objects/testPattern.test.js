import { deepStrictEqual } from 'assert';
import { testPattern } from './testPattern.js';

function test() {
    deepStrictEqual(
        testPattern('components.a.name', 'components.:x.name.:y(a|b)'),
        true
    );
    deepStrictEqual(
        testPattern('components', 'components.:x.name.:y(a|b)'),
        true
    );
    deepStrictEqual(
        testPattern('components.a.notName', 'components.:x.name.:y(a|b)'),
        false
    );
}

test();
