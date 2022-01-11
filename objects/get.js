import { normalizePath } from './normalizePath.js';
import { objToArr } from './objToArr.js';

const get = (obj, path) => {
    path = normalizePath(path);

    while (path.length) {
        const key = path.shift();
        obj = obj?.[key];
    }
    return obj;
};

export { get };
