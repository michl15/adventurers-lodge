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
};

const calculateStatModifier = (stat) => {
    return Math.floor((stat - 10) / 2);
};

// Helper function to roll stats
const rollStat = () => {
    let vals = [];
    for (let i = 0; i < 4; i++) {
        vals.push(Math.floor(Math.random() * 6) + 1);
    }
    const min = Math.min(...vals);
    const sum = vals.reduce((partialSum, a) => partialSum + a, 0) - min;
    return sum;
};

export { calculateProficiencyBonus, calculateStatModifier, rollStat };
