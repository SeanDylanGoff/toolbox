//get the intersection of two paths (in its fully expanded and normalized form)

import { normalizePath } from './normalizePath.js';
import { parsePattern } from './parsePattern.js';
import { hasCommonElement } from './hasCommonElement.js';
import { expandPathSegment } from './expandPathSegment.js';

const matchPattern = (path, pattern) => {
    pattern = parsePattern(pattern);
    path = normalizePath(path);

    const min = Math.min(path.length, pattern.length);

    const ret = {};
    for (let i = 0; i < min; i++) {
        if (pattern[i].key) {
            ret[pattern[i].key] = path[i];
        }
    }
    return ret;
};

export { matchPattern };
