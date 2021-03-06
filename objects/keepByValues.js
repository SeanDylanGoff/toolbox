//keep elements of an object by checking their values against a provided function.

const keepByValues = (obj, keepFn) => {
    const ret = {};
    Object.keys(obj).forEach(key => {
        if (keepFn(obj[key])) {
            ret[key] = obj[key];
        }
    });
    return ret;
};

export { keepByValues };
