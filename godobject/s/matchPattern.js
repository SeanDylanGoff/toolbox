function matchPattern(path, pattern) {
    const splitPattern = pattern.split('.').map((part) => part.split('|'));
    const min = Math.min(splitPattern.length, path.length);
    for (let index = 0; index < min; index++) {
        if (
            splitPattern[index][0] !== '*' &&
            !splitPattern[index].includes(path[index])
        ) {
            return false;
        }
    }
    return true;
}
export default matchPattern;
