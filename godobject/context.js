import { computed } from '/Users/sean/development/toolbox/godobject/node_modules/vue/dist/vue.esm-browser.js';

import { normalizePath } from '../objects/normalizePath.js';
import { getMultiple } from '../objects/getMultiple.js';
import { setMultiple } from '../objects/setMultiple.js';
import { parsePattern } from '../objects/parsePattern.js';
import { testPattern } from '../objects/testPattern.js';

const watchers = [];

function setupContext(store) {
    if (!store.__ctx) {
        function triggerWatchers(path, source) {
            watchers.forEach(watcher => {
                if (testPattern(path, watcher.pattern)) {
                    watcher.handler(path, null, source);
                }
            });
        }

        function setAndTrigger(path, val, source) {
            console.log('setAndTrigger', path, val, source?.id);
            setMultiple(store, path, val);
            triggerWatchers(path, source);
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
                set: (propertyPath, value, source) =>
                    setAndTrigger(
                        normalizePath([basePath, propertyPath]),
                        value,
                        source
                    ),
                getAll: propertyPath =>
                    getMultiple(store, [basePath, propertyPath]),
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
