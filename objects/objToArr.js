const objToArr = (obj, keyProperty) => {
    return Object.entries(obj).map(([key, val]) => ({
        ...val,
        [keyProperty]: key,
    }));
};

export { objToArr };
