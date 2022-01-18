//convert an object of objects into an array of objects, adding a key to each object

const objToArr = (obj, keyProperty) => {
    return Object.entries(obj).map(([key, val]) => ({
        ...val,
        [keyProperty]: key,
    }));
};

export { objToArr };
