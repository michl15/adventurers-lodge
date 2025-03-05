type ProficienciesTypes<Value> = {
    [id: string]: Value
}

type CharacterData = {
    name: string;
    class: string;
    level: string;
    key: string;
}

type Item = {
    name: string;
    description: string;
}

type SkillsTypes<Value> = {
    [id: string]: Value[]
}

type StatsTypes = {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
}

export type { ProficienciesTypes, CharacterData, Item, SkillsTypes, StatsTypes }