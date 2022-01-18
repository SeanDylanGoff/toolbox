//deep clone an object

//shamelessly stolen from https://github.com/streamich/fastest-json-clone/blob/main/lib/v1.js#L14
//converted to lambda and replaced var with let/const.
const isArray = Array.isArray;

const clone = obj => {
    if (!obj) return obj;
    if (isArray(obj)) {
        const arr = [];
        const length = obj.length;
        for (let i = 0; i < length; i++) arr.push(clone(obj[i]));
        return arr;
    } else if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        const length = keys.length;
        const newObject = {};
        for (let i = 0; i < length; i++) {
            const key = keys[i];
            newObject[key] = clone(obj[key]);
        }
        return newObject;
    }
    return obj;
};

export { clone };
