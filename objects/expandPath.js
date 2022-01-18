import { expandPathSegment } from './expandPathSegment.js';

export const expandPath = path => {
    let paths = [[]];
    path.forEach(segment => {
        paths = expandPathSegment(segment).flatMap(key => {
            return paths.map(path => {
                return [...path, key];
            });
        });
    });
    return paths;
};
