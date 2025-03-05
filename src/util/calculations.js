const calculateProficiencyBonus = (lvl) => {
    if (lvl < 5) {
        return 2;
    } else if (lvl < 9) {
        return 3;
    } else if (lvl < 13) {
        return 4;
    } else if (lvl < 17) {
        return 5;
    } else {
        return 6;
    }
}

const calculateStatModifier = (stat) => {
    return Math.floor((stat - 10) / 2);
}

export { calculateProficiencyBonus, calculateStatModifier }