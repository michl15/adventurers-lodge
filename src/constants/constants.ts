import {
    ProficienciesTypes,
    SkillsTypes,
    SpellsKnown,
    StatsTypes,
} from './types';

const BASE_STATS: StatsTypes = {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
};

const SKILLS: SkillsTypes<string> = {
    str: ['Athletics'],
    dex: ['Acrobatics', 'Sleight of Hand', 'Stealth'],
    int: ['Arcana', 'History', 'Investigation', 'Nature', 'Religion'],
    wis: ['Animal Handling', 'Insight', 'Medicine', 'Perception', 'Survival'],
    cha: ['Deception', 'Intimidation', 'Performance', 'Persuasion'],
};

const DEFAULT_PROFICIENCIES: ProficienciesTypes<boolean> = {
    Athletics: false,
    Acrobatics: false,
    'Sleight of Hand': false,
    Stealth: false,
    Arcana: false,
    History: false,
    Investigation: false,
    Nature: false,
    Religion: false,
    'Animal Handling': false,
    Insight: false,
    Medicine: false,
    Perception: false,
    Survival: false,
    Deception: false,
    Intimidation: false,
    Performance: false,
    Persuasion: false,
};

interface statsMap<Value> {
    [id: string]: Value;
}

const STATS_MAP: statsMap<string> = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma',
};

const EXTRA_EQUIPMENT = [
    'wand',
    'potion',
    'staff',
    'rod',
    'ring',
    'scroll',
    'wondrous-items',
];

const EMPTY_SPELL_SLOTS: SpellsKnown = {
    cantrips_known: 0,
    spell_slots_level_1: 0,
    spell_slots_level_2: 0,
    spell_slots_level_3: 0,
    spell_slots_level_4: 0,
    spell_slots_level_5: 0,
    spell_slots_level_6: 0,
    spell_slots_level_7: 0,
    spell_slots_level_8: 0,
    spell_slots_level_9: 0,
    spells_known: 0,
};

const CLASS_LIST = [
    'Bard',
    'Cleric',
    'Druid',
    'Ranger',
    'Paladin',
    'Sorcerer',
    'Warlock',
    'Wizard',
];

const BASE_SAVING_THROWS = {
    str: false,
    dex: false,
    con: false,
    int: false,
    wis: false,
    cha: false,
};

const LEVEL_OPTIONS = [
    {
        value: 0,
        label: 'Cantrip',
    },
    {
        value: 1,
        label: '1st Level',
    },
    {
        value: 2,
        label: '2nd Level',
    },
    {
        value: 3,
        label: '3rd Level',
    },
    {
        value: 4,
        label: '4th Level',
    },
    {
        value: 5,
        label: '5th Level',
    },
    {
        value: 6,
        label: '6th Level',
    },
    {
        value: 7,
        label: '7th Level',
    },
    {
        value: 8,
        label: '8th Level',
    },
    {
        value: 9,
        label: '9th Level',
    },
];

export {
    BASE_STATS,
    SKILLS,
    STATS_MAP,
    DEFAULT_PROFICIENCIES,
    EXTRA_EQUIPMENT,
    EMPTY_SPELL_SLOTS,
    CLASS_LIST,
    LEVEL_OPTIONS,
    BASE_SAVING_THROWS,
};
