type ProficienciesTypes<Value> = {
    [id: string]: Value
}

type CharacterData = {
    name: string;
    class: string;
    level: string;
    key: string;
    inventory: Inventory;
    stats: StatsTypes;
    skills: ProficienciesTypes<boolean>;
    image: string | undefined;
    description: string | undefined;
    hp: number;
    maxHP: number;
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

type Inventory = {
    [itemId: string]: boolean
}

export type { ProficienciesTypes, CharacterData, Item, SkillsTypes, StatsTypes, Inventory }