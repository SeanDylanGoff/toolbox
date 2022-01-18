//like get but with objects as path segments that can resolve to multiple values

import { expandPath } from './expandPath.js';
import { normalizePath } from './normalizePath.js';

//we don't use the usual get here as an optimisation - we know paths are normalized.
const get = (obj, path) => {
    while (path.length) {
        const key = path.shift();
        obj = obj?.[key];
    }
    return obj;
};

const getMultiple = (obj, path) => {
    const paths = expandPath(normalizePath(path));
    return paths.map(path => get(obj, path));
};

export { getMultiple };
