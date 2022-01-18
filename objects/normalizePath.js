//transform a path from its mixed representation (array or string) recursively into a normalized form (array of path keys)

import { flattenArr } from './flattenArr.js';

function normalizePath(path = []) {
    return flattenArr(
        flattenArr(path).map(segment => {
            if (typeof segment === 'string') {
                return segment.split('.');
            }
            return segment;
        })
    );
}

export { normalizePath };
