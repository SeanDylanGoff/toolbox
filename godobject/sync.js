import { parsePattern } from '../objects/index.js';
import createContext from './context.js';

function sync(store, peer, pattern, log) {
    const statistics = {
        sent: {
            batches: 0,
            updates: 0,
            deltas: 0,
            bytes: 0,
        },
        received: {
            batches: 0,
            updates: 0,
            deltas: 0,
            bytes: 0,
        },
    };

    log ||= () => {};
    let remoteStoreId;

    peer.transmit(pattern, {
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
        /*console.log(
            `SYNC EVENT: TRANSMIT (${peerName}) ${pattern}\n` +
            delta.map(delta => `${delta[0].join('.')} ${JSON.stringify(delta[1])}`).join('\n')
        );*/
        statistics.sent.batches++;
        statistics.sent.updates += updates.length;
        statistics.sent.bytes += peer.transmit(pattern, updates);

        updates = [];
    }

    function computeDeltas(updatedPaths, source) {
        if (!syncingQueued) {
            setTimeout(transmitDeltas, 0);
            syncingQueued = true;
        }
        //log('updatedPath', updatedPath);
        const deltas = updatedPaths.map(path => [path, get(path)]);
        //log('updatedSubTree', updatedSubTree);
        statistics.sent.deltas += deltas.length;

        updates.push({
            source,
            deltas,
        });
    }

    function receive(data, length) {
        if (data.storeId) {
            remoteStoreId = data.storeId;
            return;
        }
        //log('rx deltas');
        if (!isSlave) {
            return;
        }
        const updates = data;

        /*console.log(
            `SYNC EVENT: RECEIVE (${peerName}) ${pattern} ${delta[0][0].join('.')}\n` +
            delta.map(delta => `${delta[0].join('.')} ${JSON.stringify(delta[1])}`).join('\n')
        );*/
        //log(deltas);
        statistics.received.batches++;
        statistics.received.updates += updates.length;
        statistics.received.bytes += length;
        updates.forEach(({ source, deltas }) => {
            statistics.received.deltas += deltas.length;
            deltas.forEach(([path, value]) => {
                log(`set in ${store.__id}`);
                set(path, value, source);
            });
        });
    }

    peer.addEventListener(pattern, receive);

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
        statistics,
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
