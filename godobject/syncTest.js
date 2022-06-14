import { deepStrictEqual } from 'assert';
import createContext from './context.js';
import { parsePattern } from '../objects/parsePattern.js';
import { matchPattern } from '../objects/matchPattern.js';
import { getChangedPaths } from '../objects/getChangedPaths.js';
import createTransport from './transports/loopback.js';
import sync from './sync.js';
import chalk from 'chalk';

const coloredLogger =
    color =>
    (...args) => {
        console.log(Date.now() % 10000, chalk[color](...args));
    };

const bidiSync = (store, peer, pattern, log) =>
    sync(store, peer, pattern, log).startMaster().startSlave();

const transport0 = createTransport();
const transport1 = createTransport();
const transport2 = createTransport();

const storeA = { __id: 'storeA', data: {} };
const storeB = { __id: 'storeB', data: {} };
const storeC = { __id: 'storeC', data: {} };

const ctxA = createContext(storeA);
const ctxB = createContext(storeB);
const ctxC = createContext(storeC);

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    bidiSync(storeA, transport0.a, ':_', coloredLogger('red'));
    bidiSync(storeA, transport1.a, ':_', coloredLogger('red'));
    bidiSync(storeB, transport0.b, ':_', coloredLogger('green'));
    bidiSync(storeC, transport1.b, ':_', coloredLogger('blue'));

    bidiSync(storeB, transport2.a, ':_', coloredLogger('yellow'));
    bidiSync(storeC, transport2.b, ':_', coloredLogger('yellow'));

    await delay(100);

    ctxA.set('test', 1234);
    ctxA.set('test1', 1234);

    setTimeout(() => {
        console.log(storeA.data, storeB.data, storeC.data);
    }, 2000);
}
main();

/*
transport.a.addEventListener(d => {
    console.log('receive b --> a', d);
});
transport.b.addEventListener(d => {
    console.log('receive a --> b', d);
});
transport.a.transmit('test');
transport.b.transmit('test');
*/
