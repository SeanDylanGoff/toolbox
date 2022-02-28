const hasCommonElement = (arr1, arr2) => {
    for (let el of arr1) {
        if (arr2.includes(el)) {
            return true;
        }
    }
    return false;
};

export { hasCommonElement };
