const arrToObj = (arr, keyProperty) => {
    const obj = {};
    arr.forEach(el => {
        const { [keyProperty]: key, ...val } = el;
        obj[key] = val;
    });
    return obj;
};

export { arrToObj };
