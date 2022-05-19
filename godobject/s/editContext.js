import { computed } from 'vue';
import * as Vue from 'vue';
import normalizePath from './normalizePath';
import multipleSymbol from './multipleSymbol';

function setup({ getByPath, setByPath }) {
    function editContext(rawPath = []) {
        rawPath = normalizePath(rawPath);

        const context = {
            isMultiple: computed(() => {
                return getByPath(rawPath) === multipleSymbol;
            }),
            isUndefined: computed(() => {
                return getByPath(rawPath) === undefined;
            }),
            value: computed({
                get: () => {
                    const ret = getByPath(rawPath);
                    return ret === multipleSymbol ? undefined : ret;
                },
                set(value) {
                    setByPath(rawPath, value);
                },
            }),
            setByPath(propertyPath, value) {
                setByPath([rawPath, propertyPath], value);
            },
            getByPath(propertyPath) {
                return getByPath([rawPath, propertyPath]);
            },
            editContext(propertyPath) {
                return editContext([rawPath, propertyPath]);
            },
            path: rawPath,
        };
        return context;
    }
    return editContext();
}

export default setup;
