import { isRef } from 'vue'

function flatten(items) {
    if (!Array.isArray(items)) {
        return [items];
    }
    const flat = [];

    items.forEach((item) => {
        if (Array.isArray(item)) {
            flat.push(...flatten(item));
        } else {
            flat.push(item);
        }
    });

    return flat;
}


function normalizePath(path = []) {
    return flatten(
        flatten(path).map((segment) => {
            if (typeof segment === 'string') {
                return segment.split('.');
            }
            return segment;
        })
    ).filter((key) => !(Array.isArray(key) && !key.length));
}

export default normalizePath;
