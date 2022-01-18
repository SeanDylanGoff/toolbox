//set a property using a simple path syntax

import { normalizePath } from './normalizePath.js';

const setNormalized = (obj, normalizedPath, val) => {
    while (normalizedPath.length > 1) {
        const key = normalizedPath.shift();
        obj[key] = obj[key] || {};
        obj = obj[key];
    }
    obj[normalizedPath[0]] = val;
};

const set = (obj, path, val) => {
    setNormalized(obj, normalizePath(path), val);
};

export { set, setNormalized };
