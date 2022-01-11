import { get } from './get.js';

const packArr = (obj, mapping) => {
    const arr = [];
    mapping.forEach((path, index) => {
        if (path) {
            arr[index] = get(obj, path);
        }
    });
    return arr;
};

export { packArr };
