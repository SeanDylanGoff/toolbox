import { deepStrictEqual } from 'assert';

import { store } from './store.js';
import createContext from './context.js';

const ctx = createContext(store);

ctx.context('a.b.c').value.value = 123;
deepStrictEqual(ctx.context('a.b').values.value, [{ c: 123 }]);
ctx.context('a.b.d').value.value = 456;
deepStrictEqual(ctx.context('a.b').values.value, [{ c: 123, d: 456 }]);
ctx.context(['a', 'x', { a: true, b: true, c: false }]).value.value = 99;
deepStrictEqual(ctx.context(['a']).values.value, [
    { b: { c: 123, d: 456 }, x: { a: 99, b: 99 } },
]);
ctx.context(['a', 'y', { a: true, b: true, c: false }, 'z']).value.value = 99;
deepStrictEqual(ctx.context('a.y').values.value, [
    { a: { z: 99 }, b: { z: 99 } },
]);

const pattern = 'a.b.:key1(x|y|z).c.:key2';

const parsePattern = pattern =>
    pattern.split('.').map(segment => {
        if (segment.startsWith(':')) {
            const match = segment.match(/:(.+?)(?:\((.+)\))?$/);
            return {
                key: match[1],
                wildcard: !match[2],
                segments: match[2]?.split('|'),
            };
        }
        return { segments: [segment] };
    });

console.log(parsePattern(pattern));
