import { computed } from 'vue';
import * as Vue from 'vue';
import normalizePath from './normalizePath';
import multipleSymbol from './multipleSymbol';

function cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
}
function pathSplice(path, value, index = 1) {
    return [...path.slice(0, index), value, ...path.slice(index)];
}

function setup({ getByPath, setByPath, path: _path }) {
    function editContext(rawPath = []) {
        rawPath = normalizePath(rawPath);
        console.log('createContext', rawPath);
        //console.log('editContext()', store, rawPath);
        const valuePath = ['config', ...rawPath];
        const previewPath = ['preview', ...rawPath];
        //console.log('editContext', rawPath);
        const context = {
            isUndefined: computed(() => {
                return typeof getByPath(valuePath) === 'undefined';
            }),
            isMultiple: computed(() => {
                return getByPath(valuePath) === multipleSymbol;
            }),
            preview: computed({
                get: () => {
                    const ret = getByPath(previewPath) || getByPath(valuePath);
                    console.log('recompute preview ' + previewPath.join('.'), ret);
                    return ret === multipleSymbol ? undefined : ret;
                },
                set(value) {
                    console.log('setPreview', previewPath, value);
                    setByPath(previewPath, value);
                },
            }),
            setPreview(value) {
                context.preview.value = value;
            },

            value: computed({
                get: () => {
                    const ret = getByPath(valuePath);
                    console.log('recompute value ' + valuePath.join('.'), ret);
                    return ret === multipleSymbol ? undefined : ret;
                },
                set(value) {
                    console.log('setValue', valuePath, value);
                    setByPath(valuePath, value);
                    context.reset();
                },
            }),
            setValue(value) {
                context.value.value = value;
            },

            raw: computed({
                get: () => {
                    const ret = getByPath(rawPath);
                    //console.log('recompute value ' + rawPath.join('.'), ret);
                    return ret === multipleSymbol ? undefined : ret;
                },
                set(value) {
                    //console.log('setValue', rawPath, value);
                    setByPath(rawPath, value);
                    context.preview = value;
                },
            }),

            reset() {
                const value = cloneDeep(getByPath(['config']));
                //console.log('reset', store, rawPath, value);
                setByPath(['preview'], value);
            },
            commit() {
                const value = cloneDeep(getByPath(['preview']));
                //console.log('commit', store, rawPath, value);
                setByPath(['config'], value);
            },
            editContext(propertyPath) {
                return editContext([rawPath, propertyPath]);
            },
            path: [..._path, ...rawPath],
        };
        return context;
    }
    return editContext();
}

export default setup;
