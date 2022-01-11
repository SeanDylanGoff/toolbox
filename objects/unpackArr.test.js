import { deepStrictEqual } from 'assert';
import { unpackArr } from './unpackArr.js';

function test() {
    const input = [123, 'useless data', '33kg', '60cm', '8kg', 'black'];
    const mapping = [
        'messageId',
        ,
        'dog.weight',
        'dog.height',
        'cat.weight',
        'cat.paws.leftFront.color',
    ];
    const output = {
        messageId: 123,
        dog: { weight: '33kg', height: '60cm' },
        cat: { weight: '8kg', paws: { leftFront: { color: 'black' } } },
    };
    deepStrictEqual(unpackArr(input, mapping), output);
}

test();
