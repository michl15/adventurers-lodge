import { BASE_STATS, DEFAULT_PROFICIENCIES } from './constants';
import { CharacterData, CurrentUser, Equipment, EquipmentData } from './types';

const mockCharacterData: CharacterData = {
    name: 'mock char',
    class: {
        name: 'test class',
        index: false,
        url: false,
    },
    level: 1,
    key: 'mock key',
    inventory: [] as Equipment[],
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
    owner: 'mockid',
};

const mockUser: CurrentUser = {
    uid: 'mockid',
    displayName: 'test',
    photoURL: 'test',
    email: 'test',
    emailVerified: false,
};

const mockSword: EquipmentData = {
    name: 'sword',
    index: 'sword',
    url: 'url',
    cost: {
        quantity: 10,
        unit: 'gp',
    },
    equipment_category: {
        name: 'weapon',
        index: 'weapon',
        url: 'weapon',
    },
    damage: {
        damage_dice: 'd6',
        damage_type: {
            name: 'slashing',
            index: 'slashing',
        },
    },
    weapon_category: 'sword',
    desc: ['this is a sword'],
};

const mockArmor: EquipmentData = {
    name: 'armor',
    index: 'armor',
    url: 'url',
    cost: {
        quantity: 10,
        unit: 'gp',
    },
    equipment_category: {
        name: 'armor',
        index: 'armor',
        url: 'armor',
    },
    armor_category: 'medium',
    desc: ['medium armor', 'this is armor'],
};

export { mockCharacterData, mockUser, mockArmor, mockSword };
