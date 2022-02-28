//get the intersection of two paths (in its fully expanded and normalized form)

import { normalizePath } from './normalizePath.js';
import { parsePattern } from './parsePattern.js';
import { expandPath } from './expandPath.js';

const getChangedPaths = (path, pattern) => {
    pattern = parsePattern(pattern);
    const paths = expandPath(normalizePath(path));
    //console.log('getintersection', paths, pattern);

    const changedPaths = [];

    paths.forEach(path => {
        let curChangedPaths = [[]];
        for (let i = 0; i < pattern.length; i++) {
            let segments;
            if (!path[i]) {
                segments = pattern[i].segments;
            } else if (
                pattern[i].wildcard ||
                pattern[i].segments.includes(path[i])
            ) {
                segments = [path[i]];
            } else {
                return;
            }
            curChangedPaths = segments.flatMap(key => {
                return curChangedPaths.map(path => {
                    return [...path, key];
                });
            });
        }

        changedPaths.push(...curChangedPaths);
    });
    return changedPaths;
};

export { getChangedPaths };
