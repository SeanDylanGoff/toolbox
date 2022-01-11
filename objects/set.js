import { normalizePath } from './normalizePath.js';

const set = (obj, path, val) => {
    path = normalizePath(path);
    while (path.length > 1) {
        const key = path.shift();
        obj[key] = obj[key] || {};
        obj = obj[key];
    }
    obj[path[0]] = val;
};

export { set };
