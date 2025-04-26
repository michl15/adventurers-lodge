import { Spell } from '../constants/types';

const filterSpellListByClass = (spellList: Spell[], classIndex: string) => {
    return spellList.filter((spell) => {
        if (spell.classes) {
            for (let i = 0; i < spell.classes?.length; i++) {
                if (spell.classes[i].index === classIndex) {
                    return true;
                }
            }
            return false;
        }
        return false;
    });
};

const notEmptyList = (arr: any[]) => {
    return arr.length > 0;
};

export { filterSpellListByClass, notEmptyList };
