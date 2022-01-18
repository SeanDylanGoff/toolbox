//like set but with objects as path segments that can resolve to multiple values

import { normalizePath } from './normalizePath.js';
import { expandPath } from './expandPath.js';

const set = (obj, path, val) => {
    while (path.length > 1) {
        const key = path.shift();
        obj[key] = obj[key] || {};
        obj = obj[key];
    }
    obj[path[0]] = val;
};

const setMultiple = (obj, path, val) => {
    const paths = expandPath(normalizePath(path));
    paths.forEach(path => set(obj, path, val));
};

export { setMultiple };
