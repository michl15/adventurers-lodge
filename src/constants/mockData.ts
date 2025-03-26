import { BASE_STATS, DEFAULT_PROFICIENCIES } from './constants';
import { CharacterData, Item } from './types';

const mockCharacterData: CharacterData = {
    name: 'mock char',
    class: {
        name: 'test class',
        index: false,
        url: false,
    },
    level: 1,
    key: 'mock key',
    inventory: [] as Item[],
    stats: BASE_STATS,
    skills: DEFAULT_PROFICIENCIES,
    image: 'mock src',
    description: 'mock desc',
    hp: 10,
    maxHP: 10,
    race: {
        name: 'test race',
        index: false,
        url: false,
    },
    languages: [],
    traits: [],
};

export { mockCharacterData };
