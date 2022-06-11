//like get but with objects as path segments that can resolve to multiple values

import { expandPath } from './expandPath.js';
import { normalizePath } from './normalizePath.js';
import { getNormalized } from './get.js';

const getMultiple = (obj, path) => {
    const paths = expandPath(normalizePath(path));

    return paths.map(path => ({
        path,
        value: getNormalized(obj, path),
    }));
};

export { getMultiple };
