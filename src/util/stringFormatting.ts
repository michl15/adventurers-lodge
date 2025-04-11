const shortenString = (text: string, maxLen: number) => {
    if (text.length > maxLen) {
        return `${text.substring(0, maxLen).trim()}...`;
    }
    return text;
};

export { shortenString };
