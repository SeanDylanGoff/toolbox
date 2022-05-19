import { computed } from 'vue';
import { normalizePath } from '../objects/normalizePath.js';
import { getMultiple } from '../objects/getMultiple.js';
import { setMultiple } from '../objects/setMultiple.js';
import { parsePattern } from '../objects/parsePattern.js';
import { testPattern } from '../objects/testPattern.js';

const watchers = [];

function setupContext(store) {
    function triggerWatchers(path) {
        watchers.forEach(watcher => {
            if (testPattern(path, watcher.pattern)) {
                watcher.handler(path);
            }
        });
    }

    function setAndTrigger(path, val) {
        setMultiple(store, path, val);
        triggerWatchers(path);
    }

    function createContext(basePath = []) {
        basePath = normalizePath(basePath);

        const values = computed(() => getMultiple(store, basePath));
        const context = {
            isMultiple: computed(() => values.value.length > 1),
            isUndefined: computed(() => value.value === undefined),
            values,
            value: computed({
                get: () =>
                    values.value.length === 1 ? values.value[0] : undefined,
                set: val => setAndTrigger(basePath, val),
            }),
            set: (propertyPath, value) =>
                setAndTrigger([basePath, propertyPath], value),
            get: propertyPath => getMultiple(store, [basePath, propertyPath]),
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
    return createContext();
}

export default setupContext;
