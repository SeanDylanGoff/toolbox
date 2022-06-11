//get a property using a simple path syntax

import { normalizePath } from './normalizePath.js';

const getNormalized = (obj, normalizedPath) => {
    normalizedPath = [...normalizedPath];
    while (normalizedPath.length) {
        const key = normalizedPath.shift();
        obj = obj?.[key];
    }
    return obj;
};

const get = (obj, path) => {
    return getNormalized(obj, normalizePath(path));
};

export { get, getNormalized };
