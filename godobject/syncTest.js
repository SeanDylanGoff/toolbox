import { deepStrictEqual } from 'assert';
import createContext from './context.js';
import { parsePattern } from '../objects/parsePattern.js';
import { matchPattern } from '../objects/matchPattern.js';
import { getChangedPaths } from '../objects/getChangedPaths.js';
import createTransport from './transports/loopback.js';
import sync from './sync.js';

const transport = createTransport();

transport.a.addEventListener(data => console.log(data));
transport.b.transmit(123);

const storeA = {};
const storeB = {};

const ctxA = createContext(storeA);
const ctxB = createContext(storeB);

sync(storeA, transport.a, ':_').startMaster();
sync(storeB, transport.b, ':_').startSlave();

ctxA.set('test', 1234);

setTimeout(() => {
    console.log(
        { ...storeA, __ctx: undefined },
        { ...storeB, __ctx: undefined }
    );
    console.log(ctxB.value.value);
}, 10);
