//unpack an array into an object, e.g. for interfacing with tabular data(streams)

import { set } from './set.js';

const unpackArr = (arr, mapping) => {
    const obj = {};
    mapping.forEach((path, index) => {
        if (path) {
            set(obj, path, arr[index]);
        }
    });
    return obj;
};

export { unpackArr };
