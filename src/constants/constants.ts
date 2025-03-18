import { ProficienciesTypes, SkillsTypes, StatsTypes } from './types';

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

export { BASE_STATS, SKILLS, STATS_MAP, DEFAULT_PROFICIENCIES };
