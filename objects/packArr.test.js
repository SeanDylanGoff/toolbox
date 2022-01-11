import { deepStrictEqual } from 'assert';
import { packArr } from './packArr.js';

function test() {
    const input = {
        messageId: 123,
        dog: { weight: '33kg', height: '60cm' },
        cat: { weight: '8kg', paws: { leftFront: { color: 'black' } } },
    };
    const mapping = [
        'messageId',
        ,
        'dog.weight',
        'dog.height',
        'cat.weight',
        'cat.paws.leftFront.color',
    ];
    const output = [123, , '33kg', '60cm', '8kg', 'black'];

    deepStrictEqual(packArr(input, mapping), output);
}

test();
