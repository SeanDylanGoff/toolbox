const keepByKeys = (obj, keepFn) => {
    const ret = {};
    Object.keys(obj).forEach(key => {
        if (keepFn(key)) {
            ret[key] = obj[key];
        }
    });
    return ret;
};

export { keepByKeys };
