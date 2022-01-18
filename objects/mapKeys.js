//create an object from an object by transforming the keys. returning undefined from mapFn discards the value.

const mapKeys = (obj, mapFn) => {
    const ret = {};
    Object.keys(obj).forEach(key => {
        if (key !== undefined) {
            ret[mapFn(key)] = obj[key];
        }
    });
    return ret;
};

export { mapKeys };
