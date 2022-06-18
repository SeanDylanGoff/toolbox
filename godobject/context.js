import { computed } from 'vue';
import {
    normalizePath,
    getMultiple,
    setMultiple,
    parsePattern,
    testPattern,
    getChangedPaths,
    get,
    clone,
} from '../objects/index.js';

function setupContext(store) {
    store.__watchers ||= [];
    store.__watchers.toString = () => 'aaaa';

    const watchers = store.__watchers;
    if (!store.__ctx) {
        function triggerWatchers(path, source) {
            watchers.forEach(watcher => {
                if (testPattern(path, watcher.pattern)) {
                    watcher.handler({
                        source,
                        originalPath: path,
                        pattern: watcher.pattern,
                        get changedPaths() {
                            return getChangedPaths(path, watcher.pattern);
                        },
                    });
                }
            });
        }

        function setAndTrigger(path, val, source) {
            //console.log('setAndTrigger', path, val, source?.id, store.__id);
            val = clone(val); //storing references *would* create weird side-effects
            setMultiple(store.data, path, val);
            triggerWatchers(path, source);
        }

        function createContext(basePath = []) {
            basePath = normalizePath(basePath);

            const values = computed(() => getMultiple(store.data, basePath));
            const context = {
                isMultiple: computed(() => values.value.length > 1),
                isUndefined: computed(() => value.value === undefined),
                values,
                value: computed({
                    get: () =>
                        values.value.length === 1 ? values.value[0] : undefined,
                    set: val => setAndTrigger(basePath, val),
                }),
                set: (propertyPath, value, source) =>
                    setAndTrigger(
                        normalizePath([basePath, propertyPath]),
                        value,
                        source
                    ),
                get: propertyPath =>
                    get(store.data, normalizePath([basePath, propertyPath])),
                getAll: propertyPath =>
                    getMultiple(store.data, [basePath, propertyPath]),
                context(propertyPath) {
                    return createContext([basePath, propertyPath]);
                },
                path: basePath,
                watch: (pattern, handler) => {
                    const watcher = {
                        pattern: parsePattern([basePath, pattern]),
                        handler,
                    };
                    watchers.push(watcher);
                },
            };
            return context;
        }
        store.__ctx = createContext();
    }

    return store.__ctx;
}

export default setupContext;
