const walk = (obj, cb, path = []) => {
    if (!obj) {
        return;
    }
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            const newPath = [...path, i];
            if (
                cb(obj[i], newPath, newVal => {
                    obj[i] = newVal;
                }) !== false
            ) {
                walk(obj[i], cb, newPath);
            }
        }
    } else if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
            const newPath = [...path, key];
            if (
                cb(obj[key], newPath, newVal => {
                    obj[key] = newVal;
                }) !== false
            ) {
                walk(obj[key], cb, newPath);
            }
        });
    }
};

export { walk };
