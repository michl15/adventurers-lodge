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
    race: string;
    languages: Language[];
    traits: Trait[];
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

type Class = {
    name: string;
    index: string;
    url: string;
}

type Race = {
    index: string;
    name: string;
    url: string;
}

type Language = {
    index: string;
    name: string;
    url: string;
    source: string | undefined;
}

type Trait = {
    index: string;
    name: string;
    url: string;
    source: string | undefined;
    info: string;
}

type AbilityBonus = {
    ability_score: {
        index: string;
        name: string;
        url: string;
    }
    bonus: number;
}

export type { ProficienciesTypes, CharacterData, Item, SkillsTypes, StatsTypes, Inventory, Class, Race, Language, AbilityBonus, Trait }