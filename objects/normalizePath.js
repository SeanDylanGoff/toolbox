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
