//like set but with objects as path segments that can resolve to multiple values

import { normalizePath } from './normalizePath.js';
import { expandPath } from './expandPath.js';
import { setNormalized } from './set.js';

const setMultiple = (obj, path, val) => {
    const paths = expandPath(normalizePath(path));
    paths.forEach(path => setNormalized(obj, path, val));
};

export { setMultiple };
