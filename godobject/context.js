import { computed } from 'vue';
import { normalizePath } from '../objects/normalizePath.js';
import { getMultiple } from '../objects/getMultiple.js';
import { setMultiple } from '../objects/setMultiple.js';

function setupContext(store) {
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
                set: val => setMultiple(store, basePath, val),
            }),
            set: (propertyPath, value) =>
                setMultiple(store, [basePath, propertyPath], value),
            get: propertyPath => getMultiple(store, [basePath, propertyPath]),
            context(propertyPath) {
                return createContext([basePath, propertyPath]);
            },
            path: basePath,
        };
        return context;
    }
    return createContext();
}

export default setupContext;
