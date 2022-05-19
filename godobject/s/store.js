import { ref, isRef } from 'vue';
import * as Vue from 'vue';
import normalizePath from './normalizePath';
import multipleSymbol from './multipleSymbol';
import matchPattern from './matchPattern';

const store = ref({});

const debugging = false;
if (debugging) {
    if (localStorage.backup) store.value = JSON.parse(localStorage.backup);

    setInterval(() => {
        localStorage.backup = JSON.stringify(store.value);
    }, 3000);
}

function _getByPath(obj, path) {
    const values = new Set();
    let ret;
    //console.log('_getByPath', obj, path);
    if (!obj) {
        return undefined;
    }
    if (path.length === 0) {
        return obj;
    }
    if (typeof path[0] === 'object') {
        const keys = resolvePathKeys(path[0]);
        keys.forEach(key => {
            const value = _getByPath(obj, normalizePath([key, path.slice(1)]));
            values.add(
                typeof value === 'string' ? value : JSON.stringify(value)
            );
            ret = value;
        });
        return values.size > 1 ? multipleSymbol : ret;
    } else {
        if (path.length === 1) {
            return obj[path[0]];
        }
        return _getByPath(obj[path[0]], path.slice(1));
    }
}
function resolvePathKeys(segment) {
    //console.log('___resolve', segment);
    if (['string', 'number'].includes(typeof segment)) {
        return [segment];
    }
    if (isRef(segment)) {
        return resolvePathKeys(segment.value);
    } else if (segment) {
        return Object.keys(segment).filter(key => segment[key]);
    }
    return [];
}

function _setByPath(obj, path, value) {
    const values = new Set();
    //console.log('_setByPath', path, value);
    if (!obj) {
        return undefined;
    }
    if (typeof path[0] === 'object') {
        const keys = resolvePathKeys(path[0]);
        keys.forEach(key => {
            _setByPath(obj, normalizePath([key, path.slice(1)]), value, false);
        });
    } else {
        if (path.length === 1) {
            if (value === undefined) {
                //setting something to undefined deletes it. this makes sense as JSON
                //would cause this behavior anyways, and with safe-deep-get
                //there's no real advantage to not doing it.
                if (typeof obj[path[0]] === 'undefined') {
                    return;
                } else {
                    delete obj[path[0]];
                }
            } else {
                if (typeof obj[path[0]] === 'undefined') {
                    obj[path[0]] = value;
                    //Vue.set(obj, path[0], value);
                } else {
                    obj[path[0]] = value;
                }
            }
        } else {
            if (typeof obj[path[0]] === 'undefined') {
                obj[path[0]] = {};
                //Vue.set(obj, path[0], {});
            }
            _setByPath(obj[path[0]], path.slice(1), value, false);
        }
    }
}

function getByPath(path) {
    path = normalizePath(path);
    //console.log('get', path.join('.'));

    return _getByPath(store.value, path);
}

const watchers = [];

function unRefPath(path) {
    return path.map(key => (isRef(key) ? key.value : key));
}

function triggerWatchers(path, value, trigger) {
    const strPath = path
        .map(key => (typeof key === 'object' ? '*' : key))
        .join('.');
    watchers.forEach(watcher => {
        if (matchPattern(path, watcher.pattern)) {
            //console.log('trigger watcher', watcher.pattern, unRefPath(path));
            try {
                watcher.cb(unRefPath(path), value, trigger);
            } catch (e) {
                console.log('error in distributedStore watcher', e);
            }
        }
    });
}

function expandPath(path) {
    const paths = [];
}

function setByPath(path, value, trigger) {
    path = normalizePath(path);
    //console.log('set', path.join('.'), value);
    if (path.length === 0) {
        store.value = value;
    } else {
        _setByPath(store.value, path, value);
    }

    let paths;
    path.forEach(segment => {
        const segments = resolvePathKeys(segment);
        //console.log({ segments });
        if (!paths) {
            paths = [segments];
        } else {
            paths = paths.flatMap(path => {
                return segments.map(segment => {
                    return [...path, segment];
                });
            });
        }
    });

    //console.log({ paths });
    paths.forEach(path => {
        triggerWatchers(path, value, trigger);
    });
}

function watch(pattern, cb) {
    watchers.push({
        pattern,
        cb,
    });
}

export { store, getByPath, setByPath, watch };
