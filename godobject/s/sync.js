import { computed } from 'vue';
import { watch, setByPath, getByPath } from './store.js';

function sync(peer, pattern, peerName) {
    //console.log('init sync peer');
    const parsedPattern = pattern.split('.').map(part => part.split('|'));

    let isMaster = false;
    let isSlave = false;

    let transmit;

    let delta = [];
    let syncingQueued = false;

    function transmitDeltas() {
        syncingQueued = false;
        transmit({ pattern, delta });
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

        const updatedSubTree = getByPath(updatedPath);

        function walk(updatedSubTree, pattern, updatedPath) {
            if (pattern.length === 0) {
                if (typeof updatedSubTree === 'undefined') {
                    delta.push([updatedPath]);
                } else {
                    delta.push([updatedPath, updatedSubTree]);
                }
            } else {
                let keys = pattern[0];
                if (pattern[0][0] === '*') {
                    keys = Object.keys(updatedSubTree || {});
                }
                keys.forEach(key => {
                    walk(updatedSubTree?.[key], pattern.slice(1), [
                        ...updatedPath,
                        key,
                    ]);
                });
            }
        }

        walk(
            updatedSubTree,
            parsedPattern.slice(updatedPath.length),
            updatedPath
        );
    }

    function receive(data, source) {
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
        delta.forEach(([path, value]) => {
            //console.log('setbypath', path, value)
            setByPath(path, value, source);
        });
    }

    if (peer.postMessage) {
        transmit = function (data) {
            peer.postMessage(
                { type: 'distributedStoreSync', data: JSON.stringify(data) },
                '*'
            );
        };

        window.addEventListener('message', event => {
            //console.log(event);
            if (
                event?.data?.type === 'distributedStoreSync' &&
                event.source === peer
            ) {
                receive(JSON.parse(event.data.data), event.source);
            }
        });
    } else {
        transmit = function (data) {
            peer.send(JSON.stringify({ type: 'distributedStoreSync', data }));
        };
        const on = (peer.on || peer.addEventListener).bind(peer);
        on('message', message => {
            message = message.data || message;
            const { type, data } = JSON.parse(message.toString());
            if (type === 'distributedStoreSync') {
                receive(data, peer);
            }
        });
    }

    watch(pattern, (path, value, trigger) => {
        if (!isMaster || trigger === peer) {
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
