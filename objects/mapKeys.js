const mapKeys = (obj, mapFn) => {
    const ret = {};
    Object.keys(obj).forEach(key => {
        ret[mapFn(key)] = obj[key];
    });
    return ret;
};

export { mapKeys };
