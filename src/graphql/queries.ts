const equipmentQuery = () => {
    const query = `
    query EquipmentQuery {
        equipments(limit: 0) {
          equipment_category {
            name
          }
          name
          ... on Weapon {
            damage {
              damage_dice
              damage_type {
                name
              }
            }
            weapon_category {
              name
            }
            category_range {
              name
            }
          }
          index
          cost {
            quantity
            unit
          }
          desc
          weight
          ... on Tool {
            tool_category {
              name
            }
          }
          ... on Gear {
            gear_category {
              name
            }
          }
          ... on Pack {
            gear_category {
              name
            }
          }
          ... on Ammunition {
            gear_category {
              name
            }
          }
          ... on Armor {
            armor_category {
              name
            }
            armor_class {
              base
              dex_bonus
              max_bonus
            }
            stealth_disadvantage
            str_minimum
          }
          ... on Vehicle {
            vehicle_category {
              name
            }
            speed {
              quantity
              unit
            }
          }
          ... on IGear {
            gear_category {
              name
            }
          }
        }
      }`;

    return { query: query, queryName: 'EquipmentQuery' };
};

const equipmentQueryByIndex = (index: string) => {
    const query = `query EquipmentQueryByIndex {
        equipmentCategory(index: "${index}") {
          equipment {
            equipment_category {
              name
            }
            index
            name
            desc
            ... on MagicItem {
              rarity
              image
            }
            ... on Tool {
              weight
              tool_category {
                name
              }
              cost {
                quantity
                unit
              }
            }
            ... on Gear {
              cost {
                quantity
                unit
              }
              weight
              gear_category {
                name
              }
            }
            ... on Pack {
              cost {
                quantity
                unit
              }
              weight
              gear_category {
                name
              }
              contents {
                quantity
                item {
                  name
                }
              }
            }
            ... on Ammunition {
              cost {
                quantity
                unit
              }
              weight
              gear_category {
                name
              }
            }
            ... on Weapon {
              cost {
                quantity
                unit
              }
              weight
              damage {
                damage_dice
                damage_type {
                  name
                }
              }
              range {
                normal
                long
              }
              throw_range {
                normal
                long
              }
              weapon_category {
                name
              }
              weapon_range
              category_range {
                name
              }
              two_handed_damage {
                damage_dice
                damage_type {
                  name
                }
              }
              properties {
                name
                desc
              }
              special
            }
            ... on Armor {
              index
              name
              cost {
                quantity
                unit
              }
              desc
              weight
              armor_category {
                name
              }
              str_minimum
              stealth_disadvantage
              armor_class {
                base
                dex_bonus
                max_bonus
              }
            }
            ... on Vehicle {
              cost {
                quantity
                unit
              }
              weight
              vehicle_category {
                name
              }
              speed {
                quantity
                unit
              }
              capacity
            }
            ... on IEquipment {
              cost {
                quantity
                unit
              }
              weight
            }
            ... on IGear {
              cost {
                quantity
                unit
              }
              weight
              gear_category {
                name
              }
            }
          }
        }
      }`;

    return { query: query, queryName: 'EquipmentQueryByIndex' };
};

const getAllEquipmentCategories = () => {
    const query = `query EquipmentCategories {
        equipmentCategories {
          index
          name
        }
      }`;

    return { query: query, queryName: 'EquipmentCategories' };
};

const getAllSpells = () => {
    const query = `query AllSpellsQuery {
    spells(limit: 0, order: {by: LEVEL}) {
      index
      area_of_effect {
        type
        size
      }
      attack_type
      casting_time
      classes {
        index
      }
      components
      concentration
      damage {
        damage_type {
          name
        }
      }
      dc {
        desc
        success
        type {
          full_name
        }
      }
      desc
      duration
      higher_level
      level
      name
      range
      ritual
      school {
        name
      }
    }
  }`;

    return { query: query, queryName: 'AllSpellsQuery' };
};

const getSpellCastingData = (charLvl: number, charClassIndex: string) => {
    const query = `query Query {
    level(index: "${charClassIndex}-${charLvl}") {
      spellcasting {
        cantrips_known
        spell_slots_level_1
        spell_slots_level_2
        spell_slots_level_3
        spell_slots_level_4
        spell_slots_level_5
        spell_slots_level_6
        spell_slots_level_7
        spell_slots_level_8
        spell_slots_level_9
        spells_known
      }
    }
    class(index: "${charClassIndex}") {
      spellcasting {
        info {
          desc
          name
        }
        spellcasting_ability {
          desc
          full_name
          index
        }
      }
    }
  }`;

    return { query: query, queryName: 'SpellCastingQuery' };
};

export {
    equipmentQuery,
    equipmentQueryByIndex,
    getAllEquipmentCategories,
    getAllSpells,
    getSpellCastingData,
};
