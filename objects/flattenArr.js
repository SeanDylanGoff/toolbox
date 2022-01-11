function flattenArr(items) {
    if (!Array.isArray(items)) {
        return [items];
    }
    const flat = [];

    items.forEach(item => {
        if (Array.isArray(item)) {
            flat.push(...flattenArr(item));
        } else {
            flat.push(item);
        }
    });

    return flat;
}

export { flattenArr };
