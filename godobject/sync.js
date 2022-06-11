import { parsePattern } from '../objects/parsePattern.js';
import createContext from './context.js';

function sync(store, peer, pattern, peerName) {
    const { watch, set, getAll } = createContext(store);
    //console.log('init sync peer');
    const parsedPattern = parsePattern(pattern);

    let isMaster = false;
    let isSlave = false;

    let delta = [];
    let syncingQueued = false;

    function transmitDeltas() {
        //console.log('deltas');
        syncingQueued = false;
        peer.transmit({ pattern, delta });
        /*console.log(
            `SYNC EVENT: TRANSMIT (${peerName}) ${pattern}\n` +
            delta.map(delta => `${delta[0].join('.')} ${JSON.stringify(delta[1])}`).join('\n')
        );*/
        delta = [];
    }

    function computeDeltas(updatedPath) {
        if (!syncingQueued) {
            setTimeout(transmitDeltas, 0);
            syncingQueued = true;
        }
        console.log('updatedPath', updatedPath);
        const updatedSubTree = getAll(updatedPath);
        console.log('updatedSubTree', updatedSubTree);

        delta.push(...updatedSubTree);
    }

    function receive(data, source) {
        //console.log({ data });
        if (!isSlave) {
            return;
        }
        const { delta, pattern: _pattern } = data;
        if (pattern !== _pattern) {
            //console.log(`${_pattern} !== ${pattern}`)
            return;
        }
        /*console.log(
            `SYNC EVENT: RECEIVE (${peerName}) ${pattern} ${delta[0][0].join('.')}\n` +
            delta.map(delta => `${delta[0].join('.')} ${JSON.stringify(delta[1])}`).join('\n')
        );*/
        console.log(delta);
        delta.forEach(({ path, value }) => {
            set(path, value, source);
        });
    }

    peer.addEventListener(d => receive(d, peer));

    watch(pattern, (path, value, source) => {
        if (!isMaster || source === peer) {
            return;
        }
        computeDeltas(path);
    });

    const configurator = {
        startMaster() {
            isMaster = true;
            return configurator;
        },
        stopMaster() {
            isMaster = false;
            return configurator;
        },
        startSlave() {
            isSlave = true;
            return configurator;
        },
        stopSlave() {
            isSlave = false;
            return configurator;
        },
        forceSync() {
            computeDeltas([]);
            return configurator;
        },
    };
    return configurator;
}

export default sync;
