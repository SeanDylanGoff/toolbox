//get the intersection of two paths (in its fully expanded and normalized form)

import { normalizePath } from './normalizePath.js';
import { parsePattern } from './parsePattern.js';
import { hasCommonElement } from './hasCommonElement.js';
import { expandPathSegment } from './expandPathSegment.js';

const testPattern = (path, pattern) => {
    pattern = parsePattern(pattern);
    path = normalizePath(path).map(expandPathSegment);

    const min = Math.min(path.length, pattern.length);

    for (let i = 0; i < min; i++) {
        if (
            !pattern[i].wildcard &&
            !hasCommonElement(path[i], pattern[i].segments)
        ) {
            return false;
        }
    }
    return true;
};

export { testPattern };
