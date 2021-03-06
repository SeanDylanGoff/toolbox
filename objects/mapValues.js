//create an object from an object by transforming the values.

const mapValues = (obj, mapFn) => {
    const ret = {};
    Object.keys(obj).forEach(key => {
        ret[key] = mapFn(obj[key], key);
    });
    return ret;
};

export { mapValues };
