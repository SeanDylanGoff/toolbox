//get the intersection of a path and a pattern (in its fully expanded and normalized form)

import { normalizePath } from './normalizePath.js';
import { parsePattern } from './parsePattern.js';
import { expandPath } from './expandPath.js';

const getChangedPaths = (path, pattern) => {
    const paths = expandPath(normalizePath(path));

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
