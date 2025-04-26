const shortenString = (text: string, maxLen: number) => {
    if (text.length > maxLen) {
        return `${text.substring(0, maxLen).trim()}...`;
    }
    return text;
};

const getIndexFromString = (str: string) => {
    const lowerString = str.toLowerCase().trim();
    const index = lowerString.split(' ').join('-');
    return index;
};

export { shortenString, getIndexFromString };
