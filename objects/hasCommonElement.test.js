import { deepStrictEqual } from 'assert';
import { hasCommonElement } from './hasCommonElement.js';

function test() {
    deepStrictEqual(hasCommonElement([1], [1]), true);
    deepStrictEqual(hasCommonElement([1], []), false);
    deepStrictEqual(hasCommonElement([], [1]), false);
    deepStrictEqual(hasCommonElement([2], [3]), false);
    deepStrictEqual(hasCommonElement([1, 2, 3, 4], [5, 6, 7, 8]), false);
    deepStrictEqual(hasCommonElement([1, 2, 3, 4], [5, 3, 7, 8]), true);
}

test();
