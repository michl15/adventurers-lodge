type ProficienciesTypes<Value> = {
    [id: string]: Value;
};

type CharacterData = {
    name: string;
    class: Class;
    level: number;
    key: string;
    inventory: Equipment[];
    stats: StatsTypes;
    skills: ProficienciesTypes<boolean>;
    image: string | undefined;
    description: string | undefined;
    hp: number;
    maxHP: number;
    race: Race;
    languages: Language[];
    traits: Trait[];
};

type Item = {
    name: string;
    description: string;
};

type SkillsTypes<Value> = {
    [id: string]: Value[];
};

type StatsTypes = {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
};

type Inventory = {
    [itemId: string]: boolean;
};

type Class = {
    name: string;
    index: string | boolean;
    url: string | boolean;
};

type Race = {
    index: string | boolean;
    name: string;
    url: string | boolean;
};

type Language = {
    index: string;
    name: string;
    url: string | boolean;
    source: string | boolean;
};

type Trait = {
    index: string;
    name: string;
    url: string | boolean;
    source: string | boolean;
    info: string;
};

type AbilityBonus = {
    ability_score: {
        index: string;
        name: string;
        url: string;
    };
    bonus: number;
};

type Equipment = {
    index: string;
    name: string;
    url: string | boolean;
    quantity?: number;
};

type EquipmentData = {
    index: string;
    name: string;
    url: string | boolean;
    cost?: {
        quantity: number;
        unit: string;
    };
    desc?: string[];
    equipment_category?: EquipmentCategory;
    properties?: [];
    special?: [];
    weapon_category?: string;
    armor_category?: string;
    damage?: {
        damage_dice: string;
        damage_type: {
            name: string;
            index?: string;
            url?: string;
        };
    };
};

type EquipmentCategory = {
    index: string | boolean;
    name: string;
    url: string | boolean;
};

export type {
    ProficienciesTypes,
    CharacterData,
    Item,
    SkillsTypes,
    StatsTypes,
    Inventory,
    Class,
    Race,
    Language,
    AbilityBonus,
    Trait,
    Equipment,
    EquipmentCategory,
    EquipmentData,
};
