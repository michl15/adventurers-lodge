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
    owner: string;
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
    index: string;
    url: string | boolean;
};

type Race = {
    index: string;
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
    quantity?: number;
};

type EquipmentData = {
    index: string;
    name: string;
    url?: string | boolean;
    cost?: {
        quantity: number;
        unit: string;
    };
    desc?: string[];
    equipment_category?: EquipmentCategory;
    properties?: [];
    special?: [];
    weapon_category?: {
        name: string;
    };
    armor_category?: {
        name: string;
    };
    gear_category?: {
        name: string;
    };
    damage?: {
        damage_dice: string;
        damage_type: {
            name: string;
            index?: string;
            url?: string;
        };
    };
    tool_category?: {
        name: string;
    };
    category_range?: {
        name: string;
    };
    vehicle_category?: {
        name: string;
    };
    quantity?: number;
};

type EquipmentCategory = {
    index: string | boolean;
    name: string;
    url: string | boolean;
};

type CurrentUser = {
    uid: string;
    displayName: string | null;
    email: string | null;
    emailVerified: boolean;
    photoURL: string | null;
};

type Spell = {
    index: string;
    area_of_effect?: {
        type: string;
        size: number;
    };
    attack_type?: string;
    casting_time?: string;
    classes?: {
        index: string;
    }[];
    components?: string[];
    concentration?: boolean;
    damage?: {
        damage_type?: {
            name: string;
        };
    };
    dc?: {
        desc?: string;
        success: string;
        type: {
            full_name: string;
        };
    };
    desc?: string[];
    duration?: string;
    higher_level?: string[];
    level: number;
    name: string;
    range?: string;
    ritual?: boolean;
    school?: {
        name: string;
    };
};

type SpellsKnown = {
    cantrips_known: number;
    spell_slots_level_1: number;
    spell_slots_level_2: number;
    spell_slots_level_3: number;
    spell_slots_level_4: number;
    spell_slots_level_5: number;
    spell_slots_level_6: number;
    spell_slots_level_7: number;
    spell_slots_level_8: number;
    spell_slots_level_9: number;
    spells_known: number;
};

type SpellCastingInfo = {
    info?: {
        desc?: string[];
        name?: string;
    };
    spellcasting_ability?: {
        desc?: string[];
        full_name?: string;
        index?: string;
    };
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
    CurrentUser,
    Spell,
    SpellsKnown,
    SpellCastingInfo,
};
