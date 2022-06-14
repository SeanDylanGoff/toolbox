import { parsePattern } from '../objects/parsePattern.js';
import createContext from './context.js';

function sync(store, peer, pattern, log) {
    log ||= () => {};
    let remoteStoreId;

    peer.transmit({
        storeId: store.__id,
    });

    const { watch, set, get } = createContext(store);
    log('init sync peer');
    const parsedPattern = parsePattern(pattern);

    let isMaster = false;
    let isSlave = false;

    let updates = [];
    let syncingQueued = false;

    function transmitDeltas() {
        log(`${store.__id} --> ${remoteStoreId}`, JSON.stringify(updates));
        syncingQueued = false;
        peer.transmit({ pattern, updates });
        /*console.log(
            `SYNC EVENT: TRANSMIT (${peerName}) ${pattern}\n` +
            delta.map(delta => `${delta[0].join('.')} ${JSON.stringify(delta[1])}`).join('\n')
        );*/
        updates = [];
    }

    function computeDeltas(updatedPaths, source) {
        if (!syncingQueued) {
            setTimeout(transmitDeltas, 0);
            syncingQueued = true;
        }
        //log('updatedPath', updatedPath);
        const updatedSubTree = updatedPaths.map(path => [path, get(path)]);
        //log('updatedSubTree', updatedSubTree);

        updates.push({
            source,
            deltas: updatedSubTree,
        });
    }

    function receive(data) {
        if (data.storeId) {
            remoteStoreId = data.storeId;
            return;
        }
        //log('rx deltas');
        if (!isSlave) {
            return;
        }
        const { pattern: _pattern, updates } = data;
        if (pattern !== _pattern) {
            //console.log(`${_pattern} !== ${pattern}`)
            return;
        }
        /*console.log(
            `SYNC EVENT: RECEIVE (${peerName}) ${pattern} ${delta[0][0].join('.')}\n` +
            delta.map(delta => `${delta[0].join('.')} ${JSON.stringify(delta[1])}`).join('\n')
        );*/
        //log(deltas);
        updates.forEach(({ source, deltas }) => {
            deltas.forEach(([path, value]) => {
                log(`set in ${store.__id}`);
                set(path, value, source);
            });
        });
    }

    peer.addEventListener(d => receive(d, peer));

    watch(pattern, ({ changedPaths, source }) => {
        //log(`watch event from ${store.__id}`);
        if (!isMaster) {
            return;
        }
        if (source?.includes(remoteStoreId)) {
            return;
        }
        source ||= [];
        source.push(store.__id);
        computeDeltas(changedPaths, source);
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
