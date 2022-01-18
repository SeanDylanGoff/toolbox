export const expandPathSegment = segment => {
    if (typeof segment === 'object') {
        return Object.keys(segment).filter(key => segment[key]);
    }
    return [segment];
};
